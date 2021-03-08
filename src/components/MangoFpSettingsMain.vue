<template fill-height pa-0 ma-0>
    <v-container class="fill-height px-0 py-5 ml-0">
        <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
        ></v-progress-circular>
        <v-row v-else>
            <v-col>
                <h1>{{ locStr("MangoFp settings") }}</h1>
                <v-alert
                    dismissible
                    v-model="globalState.generalAlert.showAlert"
                    outlined
                    type="warning"
                    border="left"
                >
                    {{ globalState.generalAlert.alertMessage }}
                </v-alert>
                <v-snackbar
                    dismissible
                    v-model="globalState.generalMessage.showAlert"
                    absolute
                    centered
                    color="primary"
                    top
                    :timeout="timeout"
                    text
                >
                    {{ globalState.generalMessage.alertMessage }}
                    <template v-slot:action="{ attrs }">
                        <v-btn
                            color="white"
                            icon
                            v-bind="attrs"
                            @click="
                                globalState.generalMessage.showAlert = false
                            "
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                </v-snackbar>
                <v-tabs class="settings-main-tabs" @change="doOnChange">
                    <v-tab>{{ locStr("Define process steps") }}</v-tab>
                    <v-tab>{{ locStr("Parameters") }}</v-tab>
                    <v-tab-item transition="false" reverse-transition="false">
                        <MangoFpProcessSteps />
                    </v-tab-item>
                    <v-tab-item transition="false" reverse-transition="false">
                        <MangoFpParameters />
                    </v-tab-item>
                </v-tabs>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { getAllStates } from "@/actions";
import { locStr } from "@/utilities";
import { dataStore } from "@/main";
import * as Actions from "@/actions";
import MangoFpProcessSteps from "./MangoFpProcessSteps.vue";
import MangoFpParameters from "./MangoFpParameters.vue";

export default Vue.extend({
    name: "MangoFpSettingsMain",
    components: {
        MangoFpProcessSteps,
        MangoFpParameters,
    },
    data() {
        return {
            loading: true,
            globalState: dataStore,
            timeout: 3000,
        };
    },
    methods: {
        locStr(key: string): string {
            return locStr(key);
        },
        doOnChange() {
            Actions.clearGeneralMessage();
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
