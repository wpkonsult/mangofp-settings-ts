import { dataStore } from "@/main";

import { StateData, makeTemplateObj } from "@/types";
import * as Store from "@/store";

function _createState(
    code: string,
    action: string,
    state: string,
    order: number,
): StateData {
    const ret: StateData = {
        order,
        code,
        state: state,
        action: action,
        next: [],
        template: makeTemplateObj(),
    };
    return ret;
}

export async function addNewState(
    code: string,
    action: string,
    state: string,
): Promise<boolean> {
    const allStates: Store.AllStateType = dataStore.getAllState();
    const order = allStates.stateList.length + 1;
    const newState = _createState(code, action, state, order);
    dataStore.addState(newState);
    return true;
}

export async function updateState(
    code: string,
    action: string,
    state: string,
): Promise<boolean> {
    const allStates: Store.AllStateType = dataStore.getAllState();
    const index = allStates.stateList.findIndex(st => st.code === code);
    if (index < 0) {
        console.log("Unable to find array for editing. Code: " + code);
        return false;
    }
    const foundState = allStates.stateList[index];
    allStates.stateList[index] = { ...foundState, action, state };
    return true;
}
