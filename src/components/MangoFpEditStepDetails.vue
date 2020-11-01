<template>
    <v-expansion-panels accordion>
        <v-expansion-panel ref="infoPanel">
            <v-expansion-panel-header>
                <div class="step-panel-header">
                    {{ state.order }}.{{ state.code }}:
                    {{
                        locStr("Action" + ": ") +
                            state.action +
                            " => " +
                            locStr(" State" + ": ") +
                            state.state
                    }}
                </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <MangoFpEditStep
                    :code="state.code"
                    :action="state.action"
                    :state="state.state"
                    @close="closeInfoPane"
                    @add="updateInfoEdit"
                />
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel ref="nextStepsPanel">
            <v-expansion-panel-header>
                <div class="step-panel-header">{{ locStr("Next steps") }}:</div>
                <div class="next-state-header-blrplt">
                    {{ nextStepsNames(state.next) }}
                </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <MangoFpEditProcess
                    :state="state"
                    :allStates="possibleNextStates(state.code)"
                    :saveInProgress="saveInProgress"
                    @close="closeEdit"
                    @add="saveData"
                />
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel ref="templatePanel">
            <v-expansion-panel-header>
                <strong> {{ locStr("Email template") }}</strong>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-card class="pa-0" flat>
                    <v-card-text>
                        <v-text-field
                            class="step-text-field"
                            solo
                            :label="locStr('Addresses')"
                            :hint="locStr('CC addresses for archiving options')"
                            v-model="addresses4Edit"
                        ></v-text-field>
                        <v-textarea
                            solo
                            rows="10"
                            full-width
                            v-model="email4Edit"
                            hint="Template of the email to be sent to the contact when action of this step is executed"
                        >
                        </v-textarea>
                    </v-card-text>
                    <v-card-actions class="pl-0" color="">
                        <v-btn outlined text @click="saveTemplate">
                            {{ locStr("Confirm") }}
                        </v-btn>
                        <v-btn outlined text @click="cancelTemplate">
                            {{ locStr("Cancel") }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script lang="ts">
import Vue from "vue";
import { StateData, NextState, makeTemplateObj } from "@/types";
import { locStr } from "@/utilities";
import { VExpansionPanel } from "vuetify/lib";
import MangoFpEditProcess from "./MangoFpEditProcess.vue";
import MangoFpEditStep from "./MangoFpEditStep.vue";
import { dataStore } from "@/main";
import * as Actions from "@/actions";

//Define type that covers functions used for references VExpansionPanel (so that any can be avoided)
interface ExpansionPanelType extends InstanceType<typeof VExpansionPanel> {
    toggle: Function;
}

/*
Would it be better to avoid typecasting when selecting ref-s and instead extend refs when creating Vue object:
Instead of object Vue you can extend following object: '(Vue as VueConstructor<
    Vue & {
        $refs: {
            nextStepsPanel: ExpansionPanelType;
        };
    }
>)'

*/

export default Vue.extend({
    name: "MangoFpEditStepDetails",
    components: {
        MangoFpEditProcess,
        MangoFpEditStep,
    },
    props: {
        state: {
            type: Object,
        },
    },
    data() {
        const states: StateData[] = dataStore.getStateList();
        const template = this.state.template || makeTemplateObj();
        return {
            states,
            saveInProgress: false,
            email4Edit: template.template,
            addresses4Edit: template.addresses.join("; "),
        };
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
        possibleNextStates(paramCode: string): NextState[] {
            const next: NextState[] = [];
            const loadedStates: StateData[] = this.states;
            loadedStates.forEach((state: StateData) => {
                if (state.code !== paramCode) {
                    next.push({ value: state.code, text: state.state });
                }
            });
            return next;
        },

        nextStepsNames(stepCodes: string[]): string {
            const next: string[] = [];
            const loadedStates: StateData[] = this.states;
            loadedStates.forEach((state: StateData) => {
                if (stepCodes.includes(state.code)) {
                    next.push(state.state);
                }
            });
            if (next.length < 1) {
                return "<" + locStr("none") + ">";
            }

            return "" + next.join(", ");
        },
        async saveData(payload: { code: string; next: string[] }) {
            const isItDone = await dataStore.updateNextState(
                payload.code,
                payload.next,
            );
            if (isItDone) {
                const thePanel = this.$refs
                    .nextStepsPanel as ExpansionPanelType;
                thePanel.toggle();
            }
        },
        closeEdit() {
            this.states = dataStore.getStateList();
            const thePanel = this.$refs.nextStepsPanel as ExpansionPanelType;
            thePanel.toggle();
        },
        closeTemplatePane() {
            const thePanel = this.$refs.templatePanel as ExpansionPanelType;
            thePanel.toggle();
        },
        closeInfoPane() {
            const thePanel = this.$refs.infoPanel as ExpansionPanelType;
            thePanel.toggle();
        },
        cancelTemplate() {
            const template = this.state.template || makeTemplateObj();
            this.email4Edit = template.template;
            this.addresses4Edit = template.addresses.join("; ");
            this.closeTemplatePane();
        },
        async saveTemplate() {
            const validatedEmails = await this.validateAndGetEmailAddresses(
                this.addresses4Edit,
            ).catch(err => {
                console.log("Catched error: " + err.message);
                return false;
            });
            if (!validatedEmails) {
                return false;
            }

            const isItDone = await dataStore.updateEmailTemplate(
                this.state.code,
                this.email4Edit,
                validatedEmails,
            );

            if (isItDone) {
                this.closeTemplatePane();
            }
        },
        async validateAndGetEmailAddresses(
            addresses: string,
        ): Promise<string[]> {
            const emails = addresses.split(";").map((elem: string) => {
                const email = elem.trim();
                if (!email) {
                    return "";
                }
                const RegValidate = /([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
                if (!RegValidate.test(email)) {
                    throw new Error(
                        email + " " + this.locStr("is not proper email"),
                    );
                }
                return email;
            });
            return emails.filter((elem: string) => elem);
        },
        async updateInfoEdit(param: {
            code: string;
            action: string;
            state: string;
        }) {
            const isItDone = await Actions.updateState(
                param.code,
                param.action,
                param.state,
            );
            if (isItDone) {
                this.closeInfoPane();
            }
            console.log("Update lõpetab");
        },
    },
});
</script>
<style>
.step-panel-header {
    flex-grow: inherit !important;
    font-weight: bold;
    min-width: fit-content;
    padding-right: 10px;
}

.next-state-header-blrplt {
    padding-right: 10px;
    padding-left: 10px;
}

textarea:focus {
    color: black;
    outline-style: none;
    border-style: none;
    box-shadow: none;
}

.step-text-field input,
.step-text-field label {
    padding-left: 10px !important;
}
</style>
