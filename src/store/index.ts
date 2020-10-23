import { StateData } from "@/types";

export interface AllStateType {
    stateList: StateData[];
}

export interface Type {
    debug: boolean;
    state: AllStateType;
    addState: Function;
    updateNextState: Function;
    getAllState: Function;
    getStateList: Function;
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
            //todo add api call
            this.state.stateList.push(stateData);
            return true;
        },
        async updateNextState(
            code: string,
            nextStates: string[],
        ): Promise<boolean> {
            if (debug) {
                console.log(
                    "Will update next states of " +
                        code +
                        " to " +
                        nextStates.join(", "),
                );
            }
            const step = this.state.stateList.find(obj => obj.code === code);
            if (!step) {
                console.log("Did not find step with code " + code);
                return false;
            }
            //todo add api call
            step.next = nextStates;
            return true;
        },
        getAllState(): AllStateType {
            return this.state;
        },
        getStateList(): StateData[] {
            return this.state.stateList;
        },
    };
}
