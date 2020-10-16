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

export function addNewState(code: string, name: string): boolean {
    const allStates: Store.AllStateType = dataStore.getAllState();
    const order = allStates.stateList.length + 1;
    const newState = _createState(code, name, order);
    dataStore.addState(newState);
    return true;
}
