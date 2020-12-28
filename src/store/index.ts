import { StateData, EmailTemplate, makeTemplateObj } from "@/types";

export interface AllStateType {
    stateList: StateData[];
}

export interface Alert {
    showAlert: boolean;
    alertMessage: string;
}

export interface Type {
    generalAlert: Alert;
    debug: boolean;
    state: AllStateType;
    resetState: Function;
    addState: Function;
    updateNextState: Function;
    _findStep: Function;
    getAllState: Function;
    getStateList: Function;
    updateOrInsertEmailTemplate: Function;
    markTemplateAsLoaded: Function;
    updateOrInsertStateInfo: Function;
    updateOrder: Function;
    deleteState: Function;
    setGeneralAlert: Function;
    clearGeneralAlert: Function;
    setInfoSaving: Function;
    setTemplateSaving: Function;
}

export function makeStore(debug: boolean): Type {
    const stateList: StateData[] = [];
    return {
        generalAlert: { showAlert: false, alertMessage: "" },
        debug,
        state: { stateList },
        resetState() {
            this.state.stateList.splice(0, this.state.stateList.length);
            this.clearGeneralAlert();
        },
        setGeneralAlert(errorMsg: string) {
            this.generalAlert.showAlert = true;
            this.generalAlert.alertMessage = errorMsg;
        },
        clearGeneralAlert() {
            this.generalAlert.showAlert = false;
            this.generalAlert.alertMessage = "";
        },
        async addState(stateData: StateData): Promise<boolean> {
            this.state.stateList.push({
                ...stateData,
                ...{
                    savingInfo: false,
                    savingSteps: false,
                    savingTemplate: false,
                },
            });
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

        updateOrInsertEmailTemplate(
            code: string,
            emailTemplate: string,
            addresses: string[],
            mainAddresses: string[],
            loaded = true,
        ): EmailTemplate | boolean {
            if (debug) {
                console.log("Will update email template");
            }
            const step = this.state.stateList.find(obj => obj.code === code);
            if (!step) {
                console.log("Did not find step with code " + code);
                //TODO set error state and message
                return false;
            }

            const stepTemplate = step.template as EmailTemplate;
            stepTemplate.addresses = addresses;
            stepTemplate.mainAddresses = mainAddresses;
            stepTemplate.template = emailTemplate;
            stepTemplate.loaded = loaded;
            return stepTemplate;
        },

        _findStep(code: string) {
            const step = this.state.stateList.find(obj => obj.code === code);
            if (!step) {
                throw new Error("Step not found");
            }

            return step;
        },

        markTemplateAsLoaded(code: string, loaded = true) {
            const step = this._findStep(code);
            step.template.loaded = loaded;
            return true;
        },

        setInfoSaving(code: string, loaded = true) {
            const step = this._findStep(code);
            step.savingInfo = loaded;
            return true;
        },
        setTemplateSaving(code: string, loaded = true) {
            const step = this._findStep(code);
            step.savingTemplate = loaded;
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
                    savingInfo: false,
                    savingTemplate: false,
                    template: makeTemplateObj(code),
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

        updateOrder(code: string, order: "up" | "down"): boolean {
            const step = this.state.stateList.find(obj => obj.code === code);
            if (!step) {
                console.log("Did not find step with code " + code);
                return false;
            }
            if (step.order === 1 && order === "up") {
                return true;
            }

            if (
                step.order === this.state.stateList.length &&
                order === "down"
            ) {
                return true;
            }

            let toSwapOrder = step.order - 1;
            if (order === "down") {
                toSwapOrder = step.order + 1;
            }

            const swapStep = this.state.stateList.find(
                obj => obj.order === toSwapOrder,
            );

            if (!swapStep) {
                console.log(`Unable to find element with order: ${swapStep}`);
                return false;
            }

            swapStep.order = step.order;
            step.order = toSwapOrder;

            this.state.stateList[swapStep.order - 1] = swapStep;
            this.state.stateList[step.order - 1] = step;
            return true;
        },

        async deleteState(code: string): Promise<boolean> {
            console.log(`Store deletes ${code}`);
            return true;
        },
    };
}
