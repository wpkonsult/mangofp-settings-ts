<template>
    <v-expansion-panels accordion>
        <v-expansion-panel ref="infoPanel">
            <v-expansion-panel-header>
                <div class="step-panel-header">
                    {{ state.order }}.
                    {{
                        locStr("Step" + ": ") +
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
                    :showLoader="state.savingInfo"
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
                    @close="closeStepsPane"
                    @add="saveStepsData"
                    :showLoader="state.savingInfo"
                />
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel ref="templatePanel">
            <v-expansion-panel-header>
                <strong> {{ locStr("Email template") }}</strong>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <MangoFpEditEmailTemplate
                    :code="state.code"
                    :addresses="template.addresses"
                    :mainAddresses="template.mainAddresses"
                    :templateText="template.template"
                    :loaded="template.loaded"
                    @updateTemplate="saveTemplate"
                    @close="closeTemplatePane"
                    :showLoader="state.savingTemplate"
                    :state="state"
                />
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script lang="ts">
import Vue from "vue";
import { StateData, NextState } from "@/types";
import { locStr } from "@/utilities";
import { VExpansionPanel } from "vuetify/lib";
import MangoFpEditProcess from "./MangoFpEditProcess.vue";
import MangoFpEditStep from "./MangoFpEditStep.vue";
import MangoFpEditEmailTemplate from "./MangoFpEditEmailTemplate.vue";
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
        MangoFpEditEmailTemplate,
    },
    props: {
        state: {
            type: Object,
            required: true,
        } as Vue.PropOptions<StateData>,
    },
    data() {
        const states: StateData[] = dataStore.getStateList();
        const template = this.state.template;
        return {
            states,
            template,
            saveInProgress: false,
            tempShow: false,
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
        async saveStepsData(payload: { code: string; next: string[] }) {
            Actions.updateState(
                payload.code,
                undefined,
                undefined,
                payload.next,
            );
        },
        closeStepsPane() {
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

        async saveTemplate(payload: {
            code: string;
            addresses: string[];
            mainAddresses: string[];
            templateText: string;
        }) {
            Actions.updateTemplate(
                this.state.code,
                payload.templateText,
                payload.addresses,
                payload.mainAddresses,
            );
            this.closeTemplatePane();
        },
        async validateAndGetEmailAddresses(
            addresses: string[],
        ): Promise<string[]> {
            const specials = ["[contactEmail]"];
            const emails = addresses.map((elem: string) => {
                const email = elem.trim();
                if (!email) {
                    return "";
                }

                if (specials.includes(email)) {
                    return email;
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
            Actions.updateState(
                param.code,
                param.action,
                param.state,
                undefined,
            );
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
