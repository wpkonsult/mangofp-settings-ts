<template>
    <v-expansion-panels accordion >
        <v-expansion-panel>
            <v-expansion-panel-header>
                <div class="next-state-accordion-header">
                    {{ locStr("Next steps") }}:
                </div>
                <div>
                    {{ nextStepsNames(state.next) }}
                </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <MangoFpEditProcess
                    :state="state"
                    :allStates="possibleNextStates(state.code)"
                    @close="closeEdit"
                    @add="saveData"
                />
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
            <v-expansion-panel-header>{{
                locStr("Email template")
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script lang="ts">
import Vue from "vue";
import { StateData, NextState } from "@/types";
import { locStr } from "@/utilities";
import MangoFpEditProcess from "./MangoFpEditProcess.vue";
import { dataStore } from "@/main";

export default Vue.extend({
    name: "MangoFpEditStepDetails",
    components: {
        MangoFpEditProcess,
    },
    props: {
        state: {
            type: Object,
        },
    },
    data() {
        const states: StateData[] = dataStore.getStateList();
        return {
            states,
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
        saveData() {
            console.log(`About to save data `);
        },
        closeEdit() {
            console.log("About to cancel");
        },
    },
});
</script>
<style>
.next-state-accordion-header {
    flex-grow: inherit !important;
    font-weight: bold;
    min-width: fit-content;
    padding-right: 10px;
}
</style>
