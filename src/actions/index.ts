import { dataStore } from "@/main";
import axios from "axios";

// eslint-disable-next-line
const MANGOFP_RESOURCES = (window as any).MANGOFP_RESOURCES;
const ROOT_URL = MANGOFP_RESOURCES["adminUrl"];

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

    for (const elem of Object.keys(response.steps)) {
        await dataStore.addState(response.steps[elem]);
    }

    return true;
}

export async function addNewState(
    code: string,
    action: string,
    state: string,
): Promise<boolean> {
    //TODO make api call
    return dataStore.updateOrInsertStateInfo(code, action, state);
}

export async function updateState(
    code: string,
    action: string,
    state: string,
): Promise<boolean> {
    //TODO make api call
    return dataStore.updateOrInsertStateInfo(code, action, state);
}

export async function deleteState(code: string) {
    console.log("About to delete state " + code);
    return dataStore.deleteState(code);
}

export async function reOrderState(code: string, order: "up" | "down") {
    //TODO make api call
    return dataStore.updateOrder(code, order);
}
