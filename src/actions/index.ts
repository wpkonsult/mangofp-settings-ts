import { dataStore } from "@/main";

import { StateData } from "@/types";
import * as Store from "@/store";

function _createState(code: string, name: string, order: number): StateData {
    const ret: StateData = {
        order,
        code,
        state: code,
        action: name,
        next: [],
    };
    return ret;
}

export async function addNewState(
    code: string,
    name: string,
): Promise<boolean> {
    const allStates: Store.AllStateType = dataStore.getAllState();
    const order = allStates.stateList.length + 1;
    const newState = _createState(code, name, order);
    dataStore.addState(newState);
    return true;
}

export async function updateState(
    code: string,
    name: string,
): Promise<boolean> {
    const allStates: Store.AllStateType = dataStore.getAllState();
    const index = allStates.stateList.findIndex(st => st.code === code);
    if (index < 0) {
        console.log("Unable to find array for editing. Code: " + code);
        return false;
    }
    const foundState = allStates.stateList[index];
    foundState.action = name;
    console.log("Muudan steitti: " + JSON.stringify(foundState));

    allStates.stateList[index] = { ...foundState };
    return true;
}
