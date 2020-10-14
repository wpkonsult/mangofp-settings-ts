<template>
    <v-sheet background-color="transparent" color="basil" elevation="1">
        <v-container>
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
                        </v-timeline>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            color="deep-purple lighten-2"
                            text
                            @click="alert('Lisa')"
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
import { StateData, NextState } from "@/types";
import { locStr } from "@/utilities";

export default Vue.extend({
    name: "MangoFpProcessSteps",
    props: {
        states: {
            type: Array,
            required: true,
        } as Vue.PropOptions<StateData[]>,
    },
    data() {
        return {};
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
        modifyState: function(event: any) {
            console.log("About to modify ");
            console.log(event);
        },
    },
});
</script>
