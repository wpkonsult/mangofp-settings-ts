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

export async function reOrderState(code: string, order: "up" | "down") {
    //TODO make api call
    return dataStore.updateOrder(code, order);
}
