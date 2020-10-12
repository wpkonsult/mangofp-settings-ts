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
                <v-tabs vertical>
                    <v-tab>{{ locStr("Process") }}</v-tab>
                    <v-tab>{{ locStr("Parameters") }}</v-tab>
                    <v-tab-item
                        transition="fade-transition"
                        reverse-transition="false"
                    >
                        <MangoFpSettingsProcess :states="states" />
                    </v-tab-item>
                    <v-tab-item
                        transition="fade-transition"
                        reverse-transition="false"
                    >
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

export default Vue.extend({
    name: "MangoFpSettingsMain",
    components: {
        MangoFpSettingsProcess,
    },
    data() {
        return {
            loading: true,
            error: "",
            states: {},
        };
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
    },
    async mounted() {
        this.loading = false;
        return await fetchStates();
    },
});
</script>
<style src="@/styles/global.css"></style>
