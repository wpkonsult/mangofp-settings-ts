<template>
    <v-sheet background-color="transparent" color="basil" elevation="1">
        <v-container pa-0>
            <v-row justify="space-around">
                <v-card width="800">
                    <v-card-title>
                        {{
                            locStr(
                                "Define steps in Your contact management process",
                            )
                        }}
                    </v-card-title>
                    <v-card-text>
                        <div class="font-weight-bold ml-8 mb-2">
                            {{ locStr("Steps") }}
                        </div>
                        <v-timeline align-top dense>
                            <v-timeline-item
                                v-for="state in states"
                                :key="state.order"
                                small
                            >
                                <v-card v-if="stepInEdit != state.code">
                                    <v-card-text>
                                        <div class="font-weight-normal">
                                            {{ state.order }}.
                                            <strong>{{ state.code }}</strong>
                                            <span v-if="state.state">
                                                : {{ state.state }}
                                            </span>
                                        </div>
                                        <div>{{ state.action }}</div>
                                    </v-card-text>
                                    <v-expansion-panels accordion>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header>{{
                                                locStr("Next steps")
                                            }}</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <MangoFpEditProcess
                                                    :state="state"
                                                    :nextStates="
                                                        possibleNextStates(
                                                            state.code,
                                                        )
                                                    "
                                                />
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header>{{
                                                locStr("Email template")
                                            }}</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit, sed
                                                do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.
                                                Ut enim ad minim veniam, quis
                                                nostrud exercitation ullamco
                                                laboris nisi ut aliquip ex ea
                                                commodo consequat.
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                    <v-card-actions>
                                        <v-btn
                                            text
                                            @click="modifyState(state.code)"
                                        >
                                            {{ locStr("Modify") }}
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                                <MangoFpEditStep
                                    v-else
                                    :code="state.code"
                                    :description="state.action"
                                    @close="closeStepEdit"
                                    @add="updateStepEdit"
                                />
                            </v-timeline-item>
                            <v-timeline-item v-if="newStepModifyOpen">
                                <MangoFpEditStep
                                    code=""
                                    description=""
                                    @close="closeStepEdit"
                                    @add="addStepEdit"
                                />
                            </v-timeline-item>
                        </v-timeline>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="black" text @click="openStepAdd">
                            {{ locStr("Add state") }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-container>
    </v-sheet>
</template>
<script lang="ts">
import Vue from "vue";
import { StateData, NextState } from "@/types";
import { locStr } from "@/utilities";
import MangoFpEditStep from "./MangoFpEditStep.vue";
import MangoFpEditProcess from "./MangoFpEditProcess.vue";
import * as Actions from "@/actions";

export default Vue.extend({
    name: "MangoFpProcessSteps",
    components: {
        MangoFpEditStep,
        MangoFpEditProcess,
    },
    props: {
        states: {
            type: Array,
            required: true,
        } as Vue.PropOptions<StateData[]>,
    },
    data() {
        return {
            newStepModifyOpen: false,
            stepInEdit: "",
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

        modifyState: function(stateCode: string) {
            this.stepInEdit = stateCode;
            this.newStepModifyOpen = false;
        },
        closeStepEdit: function() {
            this.newStepModifyOpen = false;
            this.stepInEdit = "";
        },
        openStepAdd: function() {
            this.newStepModifyOpen = true;
            this.stepInEdit = "";
        },
        addStepEdit: async function(param: { code: string; name: string }) {
            const isItDone = await Actions.addNewState(param.code, param.name);
            if (isItDone) {
                this.closeStepEdit();
            }
        },
        updateStepEdit: async function(param: { code: string; name: string }) {
            console.log(`About to modify ${param.name}`);
            const isItDone = await Actions.updateState(param.code, param.name);
            this.closeStepEdit();
            if (isItDone) {
                this.closeStepEdit();
            }
        },
    },
});
</script>
