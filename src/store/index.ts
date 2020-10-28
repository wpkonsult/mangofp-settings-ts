import { StateData, makeTemplateObj } from "@/types";

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
    updateEmailTemplate: Function;
    updateOrInsertStateInfo: Function;
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
            step.next = nextStates;
            return true;
        },

        async updateEmailTemplate(
            code: string,
            emailTemplate: string,
            addresses?: string[],
        ): Promise<boolean> {
            if (debug) {
                console.log(`Will update email template`);
            }
            const step = this.state.stateList.find(obj => obj.code === code);
            if (!step) {
                console.log("Did not find step with code " + code);
                return false;
            }

            if (!step.template) {
                step.template = makeTemplateObj();
            }
            step.template.template = emailTemplate;
            step.template.addresses = addresses || [];
            return true;
        },
        async updateOrInsertStateInfo(
            code: string,
            action: string,
            state: string,
        ): Promise<boolean> {
            if (debug) {
                console.log(`Will update state info`);
            }
            const step = this.state.stateList.find(obj => obj.code === code);
            if (!step) {
                console.log(
                    "Did not find step with code " + code + ". Will add",
                );
                const newStep: StateData = {
                    order: this.state.stateList.length + 1,
                    code,
                    state,
                    action,
                    next: [],
                    template: makeTemplateObj(),
                };
                return this.addState(newStep);
            }
            step.action = action;
            step.state = state;
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
