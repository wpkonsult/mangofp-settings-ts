<template fill-height pa-0 ma-0>
    <v-container class="fill-height px-0 py-5 ml-0">
        <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
        ></v-progress-circular>
        <div v-else>
            <h1>{{ locStr("MangoFp settings") }}</h1>
            <v-sheet class="mt-4">
                <v-alert
                    v-if="error"
                    dismissible
                    outlined
                    type="warning"
                    border="left"
                >
                    {{ error }}
                </v-alert>
                <v-tabs class="settings-main-tabs" vertical>
                    <v-tab>{{ locStr("Define process steps") }}</v-tab>
                    <v-tab>{{ locStr("Next steps from every step") }}</v-tab>
                    <v-tab>{{ locStr("Templates") }}</v-tab>
                    <v-tab>{{ locStr("Parameters") }}</v-tab>
                    <v-tab-item transition="false" reverse-transition="false">
                        <MangoFpProcessSteps :states="states" />
                    </v-tab-item>
                    <v-tab-item transition="false" reverse-transition="false">
                        <MangoFpSettingsProcess :states="states" />
                    </v-tab-item>
                    <v-tab-item transition="false" reverse-transition="false">
                        Siia tulevad mallid
                    </v-tab-item>
                    <v-tab-item transition="false" reverse-transition="false">
                        Siia tulevad üldised parameetrid
                    </v-tab-item>
                </v-tabs>
            </v-sheet>
        </div>
    </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { fetchStates } from "@/controllers/states";
import { locStr } from "@/utilities";
import MangoFpSettingsProcess from "./MangoFpSettingsProcess.vue";
import MangoFpProcessSteps from "./MangoFpProcessSteps.vue";
import { dataStore } from "@/main";

export default Vue.extend({
    name: "MangoFpSettingsMain",
    components: {
        MangoFpSettingsProcess,
        MangoFpProcessSteps,
    },
    data() {
        return {
            loading: true,
            error: "",
            states: dataStore.state.stateList,
        };
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
    },
    async mounted() {
        this.loading = false;
        const retData = await fetchStates();
        console.log("Returned data:");
        console.log(retData);
        for (const elem of retData) {
            await dataStore.addState(elem);
        }
    },
});
</script>
<style src="@/styles/global.css"></style>
