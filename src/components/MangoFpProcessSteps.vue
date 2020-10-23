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
                                    <v-card-title class="pl-5">
                                        {{ state.order }}.{{ state.code }}
                                    </v-card-title>
                                    <v-card-subtitle class="pl-5">
                                        {{ state.action }}
                                        <span v-if="state.state">
                                            => {{ state.state }}
                                        </span>
                                    </v-card-subtitle>
                                    <v-card-text>
                                        <MangoFpEditStepDetails
                                            :state="state"
                                        />
                                    </v-card-text>
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
                                    :action="state.action"
                                    :state="state.state"
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
import { StateData } from "@/types";
import { locStr } from "@/utilities";
import MangoFpEditStep from "./MangoFpEditStep.vue";
import MangoFpEditStepDetails from "./MangoFpEditStepDetails.vue";
import * as Actions from "@/actions";

export default Vue.extend({
    name: "MangoFpProcessSteps",
    components: {
        MangoFpEditStep,
        MangoFpEditStepDetails,
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
        addStepEdit: async function(param: {
            code: string;
            action: string;
            state: string;
        }) {
            const isItDone = await Actions.addNewState(
                param.code,
                param.action,
                param.state,
            );
            if (isItDone) {
                this.closeStepEdit();
            }
        },
        updateStepEdit: async function(param: {
            code: string;
            action: string;
            state: string;
        }) {
            const isItDone = await Actions.updateState(
                param.code,
                param.action,
                param.state,
            );
            this.closeStepEdit();
            if (isItDone) {
                this.closeStepEdit();
            }
        },
    },
});
</script>
