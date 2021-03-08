import { dataStore } from "@/main";
import axios from "axios";
import { makeTemplateObj, StateData, Parameter } from "@/types";
import { locStr } from "@/utilities";

// eslint-disable-next-line
const MANGOFP_RESOURCES = (window as any).MANGOFP_RESOURCES;
const ROOT_URL = MANGOFP_RESOURCES["adminUrl"];
const MANGOFP_NONCE = MANGOFP_RESOURCES["nonce"];

interface StepsMetadata {
    [key: string]: StateData;
}
interface PostRequest {
    code?: string;
    action?: string;
    state?: string;
    next?: string[];
}
interface TemplateRequest {
    code: string;
    templateText: string;
    emails: string[];
    primaryEmails: string[];
}

interface OptionsRequest {
    options: { key: string; value: string }[];
}

async function __makeGetRequest(endpoint: string) {
    const config = {
        headers: {
            "X-WP-Nonce": MANGOFP_NONCE,
        },
    };
    const res = await axios.get(ROOT_URL + endpoint, config);
    if (!res || res.status !== 200) {
        throw new Error("Unable to read data from " + endpoint);
    }

    if (
        !("status" in res.data) ||
        res.data.status !== "RESULT_SUCCESS" ||
        !("payload" in res.data)
    ) {
        throw new Error("Could not read response status");
    }

    return res.data.payload;
}

async function __makePostRequest(
    endpoint: string,
    properties: PostRequest | TemplateRequest | OptionsRequest,
) {
    const config = {
        headers: {
            "X-WP-Nonce": MANGOFP_NONCE,
        },
    };
    const res = await axios.post(ROOT_URL + endpoint, properties, config);
    if (!res || res.status !== 200) {
        throw new Error("Error received from request. Details: " + endpoint);
    }

    if (
        !("status" in res.data) ||
        res.data.status !== "RESULT_SUCCESS" ||
        !("payload" in res.data)
    ) {
        throw new Error("Could not read response status");
    }

    return res.data.payload;
}

async function reloadAllSteps(steps: StepsMetadata) {
    dataStore.resetState();
    for (const aStep of Object.keys(steps)) {
        const step = steps[aStep];
        step.template = makeTemplateObj(step.code);
        await dataStore.addState(step);
    }
    return true;
}

export async function getAllStates() {
    const response = await __makeGetRequest("/steps").catch(err => {
        dataStore.setGeneralAlert(
            locStr("Unable to fetch all states: " + err.message),
        );
        return false;
    });

    if (!response.steps) {
        dataStore.setGeneralAlert(
            locStr("No steps in response while getting all states"),
        );
        return false;
    }

    return await reloadAllSteps(response.steps);
}

function _processOptionsResponseToStore(options: Parameter[]) {
    for (const label in options) {
        dataStore.setOption(options[label]);
    }
    return true;
}

export async function getAllOptions(): Promise<boolean> {
    const response = await __makeGetRequest("/option").catch(err => {
        dataStore.setGeneralAlert(
            locStr("Unable to fetch options: " + err.message),
        );
        return false;
    });

    if (!response.options) {
        dataStore.setGeneralAlert(
            locStr("No options in response while getting options"),
        );
        return false;
    }

    return _processOptionsResponseToStore(response.options);
}

export async function addNewState(
    action: string,
    state: string,
): Promise<boolean> {
    const response = await __makePostRequest("/steps", { action, state }).catch(
        err => {
            dataStore.setGeneralAlert(
                locStr("Failed to add new step: " + err.message),
            );
            return false;
        },
    );

    if (!response.steps) {
        dataStore.setGeneralAlert(
            locStr("No steps in response when loading new state"),
        );
        return false;
    }

    return await reloadAllSteps(response.steps);
}

export async function updateState(
    code: string,
    action: string | undefined,
    state: string | undefined,
    next: string[] | undefined,
): Promise<boolean> {
    dataStore.setInfoSaving(code, true);

    const response = await __makePostRequest("/steps/" + code, {
        action,
        state,
        next,
    }).catch(err => {
        dataStore.setGeneralAlert(
            locStr("Failed to update a step: " + err.message),
        );
        dataStore.setInfoSaving(code, false);
        return false;
    });

    if (!response.steps) {
        dataStore.setGeneralAlert(
            locStr(
                "Error loading data from server: Steps not found in response.",
            ),
        );
        dataStore.setInfoSaving(code, false);

        return false;
    }

    return await reloadAllSteps(response.steps);
}

export async function deleteState(code: string) {
    const response = await __makePostRequest(
        "/steps/" + code + "/delete",
        {},
    ).catch(err => {
        dataStore.setGeneralAlert(
            locStr("Failed to delete a step: " + err.message),
        );

        return false;
    });

    if (!response.steps) {
        console.log("No steps in response");
        return false;
    }

    return await reloadAllSteps(response.steps);
}

export async function reOrderState(code: string, order: "up" | "down") {
    dataStore.updateOrder(code, order);
    __makePostRequest("/steps/" + code + "/move" + order, {}).catch(err => {
        getAllStates();
        dataStore.setGeneralAlert(
            locStr(
                "Error while fetching data during steps reordering: " +
                    err.message,
            ),
        );
        return;
    });
    return;
}

export async function loadTemplate(code: string): Promise<boolean> {
    const response = await __makeGetRequest(`/templates/${code}`).catch(err => {
        dataStore.setGeneralAlert(
            locStr(
                "Error while fetching data for email templates: " + err.message,
            ),
        );
        return false;
    });

    if (!response) {
        //TODO More error handling?
        return false;
    }

    if ("template" in response && code in response.template) {
        const template = response.template[code];
        dataStore.updateOrInsertEmailTemplate(
            code,
            template.template,
            template.addresses,
            template.mainAddresses,
            true,
        );
    } else {
        dataStore.markTemplateAsLoaded(code);
    }

    return true;
}

export async function updateTemplate(
    code: string,
    templateText: string,
    emails: string[],
    mainEmails: string[],
) {
    const templateParams: TemplateRequest = {
        code,
        templateText,
        emails,
        primaryEmails: mainEmails,
    };

    dataStore.setTemplateSaving(code, true);

    const response = await __makePostRequest(
        "/templates/" + code,
        templateParams,
    ).catch(err => {
        dataStore.setGeneralAlert(
            locStr("Failed to update an email template: " + err.message),
        );
        dataStore.setTemplateSaving(code, false);
        return false;
    });

    if (response) {
        await dataStore.updateOrInsertEmailTemplate(
            code,
            templateText,
            emails,
            mainEmails,
            true,
        );
    }

    dataStore.setTemplateSaving(code, false);
    return false;
}

export async function updateOptions(params: Parameter[]) {
    const storableData = params.map(option => {
        return {
            key: option.label,
            value: option.value,
        };
    });
    const response = await __makePostRequest("/options", {
        options: storableData,
    }).catch(err => {
        dataStore.setGeneralAlert(
            locStr("Failed to store options:") + " " + err.message,
        );
        return false;
    });

    if (!response.options) {
        dataStore.setGeneralAlert(
            locStr("No options in response while updating options"),
        );
    } else {
        _processOptionsResponseToStore(response.options);
    }
    dataStore.setGeneralMessage(locStr("Changes to parameters applied"));
}

export function clearGeneralMessage() {
    dataStore.clearGeneralMessage();
}
