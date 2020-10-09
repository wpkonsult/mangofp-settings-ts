<template fill-height>
    <v-container class="fill-height">
        <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
        ></v-progress-circular>
        <v-sheet v-else class="pa-md-4">
            <h3>{{ locStr("MangoFp settings") }}</h3>
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
                    <!--MangoFpSettingsProcess :states="states" /-->
                    MangoFpSettingsProcess
                </v-tab-item>
                <v-tab-item
                    transition="fade-transition"
                    reverse-transition="false"
                >
                    Siia tulevad üldised parameetrid
                </v-tab-item>
            </v-tabs>
        </v-sheet>
    </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { fetchStates } from "@/controllers/states";
import { locStr } from "@/utilities";

export default Vue.extend({
	name: "MangoFpSettingsMain",
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
		}
	},
    async mounted() {
        this.loading = false;
        return await fetchStates();
    },
});
</script>
