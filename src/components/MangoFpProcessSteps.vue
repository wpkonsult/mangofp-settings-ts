<template>
    <v-sheet background-color="transparent" color="basil" elevation="1">
        <v-container pa-0>
            <v-row justify="space-around">
                <v-card width="600">
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
                                <v-card>
                                    <v-card-text>
                                        <div class="font-weight-normal">
                                            <strong>{{ state.code }}</strong>
                                        </div>

                                        <div>{{ state.action }}</div>
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
                            </v-timeline-item>
                            <v-timeline-item>
                                <MangoFpEditStep
                                    code="CHANGETHIS"
                                    description="Sasd asdfasdf as"
                                    @close="closeStepEdit"
                                    @add="addStepEdit"
                                />
                            </v-timeline-item>
                        </v-timeline>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            color="deep-purple lighten-2"
                            text
                            @click="addState"
                        >
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
import * as Actions from "@/actions";

export default Vue.extend({
    name: "MangoFpProcessSteps",
    components: {
        MangoFpEditStep,
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
        };
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
        modifyState: function(stateCode: string) {
            console.log("About to modify ");
            console.log(stateCode);
        },
        addState: function() {
            console.log("About to add state");
        },
        closeStepEdit: function(param: string) {
            console.log("Need to close edit: " + param);
            this.newStepModifyOpen = false;
        },
        openStepEdit: function() {
            this.newStepModifyOpen = true;
        },
        addStepEdit: function(param: { code: string; name: string }) {
            console.log("About to add: " + param.code + " name: " + param.name);
            Actions.addNewState(param.code, param.name);
        },
    },
});
</script>
