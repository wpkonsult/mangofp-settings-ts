<template>
    <v-sheet background-color="transparent" color="basil" elevation="1">
        <v-container>
            <h2>
                {{ locStr("Define steps in Your contact management process") }}
            </h2>
            <v-tabs
                next-icon="mdi-arrow-right-bold-box-outline"
                prev-icon="mdi-arrow-left-bold-box-outline"
                show-arrows
                v-model="tab"
            >
                <v-tabs-slider></v-tabs-slider>
                <v-tab v-for="state in states" :key="state.order">
                    {{ state.state }}
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item
                    v-for="state in states"
                    :key="state.order"
                    transition="fade-transition"
                    reverse-transition="fade-transition"
                >
                    <MangoFpEditProcess
                        :state="state"
                        :nextStates="possibleNextStates(state.code)"
                    />
                </v-tab-item>
            </v-tabs-items>
        </v-container>
    </v-sheet>
</template>
<script lang="ts">
import Vue from "vue";
import { StateData, NextState } from "@/types";
import MangoFpEditProcess from "./MangoFpEditProcess.vue";
// eslint-disable-next-line
import { locStr } from "@/utilities";

export default Vue.extend({
    name: "MangoFpSettingsProcess",
    components: {
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
            tab: null,
        };
    },
    methods: {
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
        locStr: function(key: string): string {
            return locStr(key);
        },
    },
});
</script>
