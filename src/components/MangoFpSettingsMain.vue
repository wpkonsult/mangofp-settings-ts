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
                    dismissible
                    v-model="globalState.generalAlert.showAlert"
                    outlined
                    type="warning"
                    border="left"
                >
                    error: {{ globalState.generalAlert.alertMessage }}
                </v-alert>
                <v-tabs class="settings-main-tabs" vertical>
                    <v-tab>{{ locStr("Define process steps") }}</v-tab>
                    <v-tab>{{ locStr("Parameters") }}</v-tab>
                    <v-tab-item transition="false" reverse-transition="false">
                        <MangoFpProcessSteps />
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
import { getAllStates } from "@/actions";
import { locStr } from "@/utilities";
import { dataStore } from "@/main";
import MangoFpProcessSteps from "./MangoFpProcessSteps.vue";

export default Vue.extend({
    name: "MangoFpSettingsMain",
    components: {
        MangoFpProcessSteps,
    },
    data() {
        return {
            loading: true,
            globalState: dataStore,
        };
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
    },
    async mounted() {
        const loaded = await getAllStates();
        this.loading = !loaded;
    },
});
</script>
<style>
.main {
    background-color: #f1f1f1 !important;
    color: #444;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 13px;
    line-height: 1.4em;
}

h1 {
    font-size: 23px;
    font-weight: 400;
    margin: 0;
    padding: 9px 0 4px 0;
    line-height: 1.3;
}

h3 {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 2.1em;
}

.settings-main-tabs .v-tab {
    text-align: left !important;
    justify-content: left !important;
    text-transform: none !important;
}
</style>
