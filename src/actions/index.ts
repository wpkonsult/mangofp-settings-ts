import { dataStore } from "@/main";
import axios from "axios";
import { StateData } from "@/types";

// eslint-disable-next-line
const MANGOFP_RESOURCES = (window as any).MANGOFP_RESOURCES;
const ROOT_URL = MANGOFP_RESOURCES["adminUrl"];
interface StepsMetadata {
    [key: string]: StateData;
}

interface PostRequest {
    code?: string;
    action?: string;
    state?: string;
}

async function __makeGetRequest(endpoint: string) {
    const res = await axios.get(ROOT_URL + endpoint);
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

async function __makePostRequest(endpoint: string, properties: PostRequest) {
    const res = await axios.post(ROOT_URL + endpoint, properties);
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
        await dataStore.addState(steps[aStep]);
    }

    return true;
}

export async function getAllStates() {
    const response = await __makeGetRequest("/steps").catch(err => {
        console.log("Now there is an error: " + err.message);
        return false;
    });

    console.log(response);
    if (!response.steps) {
        console.log("No steps in response");
        return false;
    }

    return await reloadAllSteps(response.steps);
}

export async function addNewState(
    action: string,
    state: string,
): Promise<boolean> {
    const response = await __makePostRequest("/steps", { action, state }).catch(
        err => {
            console.log("Failed to add new step: " + err.message);
            return false;
        },
    );

    if (!response.steps) {
        console.log("No steps in response");
        return false;
    }

    return await reloadAllSteps(response.steps);
}

export async function updateState(
    code: string,
    action: string,
    state: string,
): Promise<boolean> {
    const response = await __makePostRequest("/steps/" + code, {
        action,
        state,
    }).catch(err => {
        console.log("Failed to add new step: " + err.message);
        return false;
    });

    if (!response.steps) {
        console.log("No steps in response");
        return false;
    }

    return await reloadAllSteps(response.steps);
}

export async function deleteState(code: string) {
    const response = await __makePostRequest(
        "/steps/" + code + "/delete",
        {},
    ).catch(err => {
        console.log("Now there is an error: " + err.message);
        return false;
    });

    if (!response.steps) {
        console.log("No steps in response");
        return false;
    }

    return await reloadAllSteps(response.steps);
}

export async function reOrderState(code: string, order: "up" | "down") {
    //TODO make api call
    return dataStore.updateOrder(code, order);
}
