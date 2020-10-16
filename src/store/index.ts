import { StateData } from "@/types";

export interface AllStateType {
    stateList: StateData[];
}

export interface Type {
    debug: boolean;
    state: AllStateType;
    addState: Function;
    getAllState: Function;
}
// eslint-disable-next-line
export function makeStore(bus: any, debug: boolean): Type {
    const stateList: StateData[] = [];
    return {
        debug,
        state: { stateList },
        async addState(stateData: StateData): Promise<boolean> {
            if (debug) {
                console.log(
                    "Will add state data: " + JSON.stringify(stateData),
                );
            }
            this.state.stateList.push(stateData);
            return true;
        },
        getAllState(): AllStateType {
            return this.state;
        },
    };
}
