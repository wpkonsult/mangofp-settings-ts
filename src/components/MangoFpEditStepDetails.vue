<template>
    <v-expansion-panels accordion>
        <v-expansion-panel ref="nextStepsPanel">
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
                    :saveInProgress="saveInProgress"
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
import { VExpansionPanel } from "vuetify/lib";
import MangoFpEditProcess from "./MangoFpEditProcess.vue";
import { dataStore } from "@/main";

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
            saveInProgress: false,
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
