<template>
    <div>
        <v-card class="pa-0" flat>
            <v-card-text class="next-steps pa-0">
                <v-switch
                    v-for="elem in allStates"
                    :key="elem.value"
                    class="col-md-6 pa-0 mt-1"
                    v-model="next4Edit"
                    inset
                    :label="elem.text"
                    :value="elem.value"
                ></v-switch>
            </v-card-text>
            <v-card-actions class="pl-0" color="">
                <v-btn outlined text @click="saveData">
                    {{ locStr("Confirm") }}
                </v-btn>
                <v-btn outlined text @click="cancelSaving">
                    {{ locStr("Cancel") }}
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-overlay :value="showLoader" :absolute="absolute">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import { locStr } from "@/utilities";
export default Vue.extend({
    name: "MangoFpEditProcess",
    props: {
        state: {
            type: Object,
            required: true,
        },

        allStates: {
            type: Array,
            required: true,
        },
        showLoader: {
            type: Boolean,
        },
    },
    data() {
        return {
            next4Edit: [...this.state.next],
            absolute: true,
        };
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
        saveData() {
            this.$emit("add", {
                code: this.state.code,
                next: this.next4Edit,
            });
        },
        cancelSaving() {
            this.next4Edit = [...this.state.next];
            this.$emit("close");
        },
    },
});
</script>

<style>
.v-menu__content {
    margin-left: -180px;
    margin-top: -25px;
}
.v-select.v-text-field input {
    display: none;
}

.next-steps .v-messages.theme--light.primary--text,
.next-steps .v-messages.theme--light {
    display: none;
}
</style>
