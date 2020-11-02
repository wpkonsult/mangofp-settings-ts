import { dataStore } from "@/main";

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
