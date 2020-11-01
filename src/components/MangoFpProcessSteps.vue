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
                                <v-card class="steps-background">
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
                                            @click.stop="
                                                deleteDialogOpen = true
                                            "
                                        >
                                            {{ locStr("Delete1") }}
                                        </v-btn>
                                        <v-dialog
                                            v-model="deleteDialogOpen"
                                            max-width="290"
											:retain-focus="false"
											overlay-opacity=0.5
											overlay-color="white"
											light
                                        >
                                            <v-card>
                                                <v-card-title class="headline">
                                                    Use Google's location
                                                    service?
                                                </v-card-title>

                                                <v-card-text>
                                                    Let Google help apps
                                                    determine location. This
                                                    means sending anonymous
                                                    location data to Google,
                                                    even when no apps are
                                                    running.
                                                </v-card-text>

                                                <v-card-actions>
                                                    <v-spacer></v-spacer>

                                                    <v-btn
                                                        color="green darken-1"
                                                        text
                                                        @click="
                                                            deleteDialogOpen = false
                                                        "
                                                    >
                                                        Disagree
                                                    </v-btn>

                                                    <v-btn
                                                        color="green darken-1"
                                                        text
                                                        @click="
                                                            deleteDialogOpen = false
                                                        "
                                                    >
                                                        Agree
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                        <div class="reordering">
                                            <span>
                                                {{ locStr("Reorder") }}
                                            </span>
                                            <v-btn
                                                class="ml-2 pa-0"
                                                text
                                                @click="orderStepUp(state.code)"
                                            >
                                                {{ locStr("Up") }}</v-btn
                                            >
                                            <v-btn
                                                class="ml-2 pa-0"
                                                text
                                                @click="
                                                    orderStepDown(state.code)
                                                "
                                            >
                                                {{ locStr("Down") }}</v-btn
                                            >
                                        </div>
                                    </v-card-actions>
                                </v-card>
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
            deleteDialogOpen: false,
        };
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
        closeStepEdit: function() {
            this.newStepModifyOpen = false;
        },
        openStepAdd: function() {
            this.newStepModifyOpen = true;
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
        deleteStep: async function(code: string) {
            console.log("delete code: " + code);
            this.deleteDialogOpen = false;
            return true;
        },
        orderStepUp: async function(code: string) {
            console.log("Order up");
            return Actions.reOrderState(code, "up");
        },
        orderStepDown: async function(code: string) {
            console.log("Order down");
            return Actions.reOrderState(code, "down");
        },
    },
});
</script>
<style>
.steps-background {
    background-color: #f1f1f1 !important;
    border-color: #f1f1f1 !important;
    margin-top: -7px;
    margin-left: -10px;
}

.reordering {
    margin-left: auto;
    padding-right: 10px;
}
</style>
