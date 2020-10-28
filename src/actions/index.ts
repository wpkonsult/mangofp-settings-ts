import { dataStore } from "@/main";

import { StateData, makeTemplateObj } from "@/types";
import * as Store from "@/store";

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
