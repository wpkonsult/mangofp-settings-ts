<template>
    <v-card dark color="#f1f1f1">
        <v-card-text class="pb-0">
            <v-text-field
                light
                class="input-on-card"
                :hint="
                    locStr(
                        'Action - What should be done to achieve result of this step',
                    )
                "
                solo
                dense
                :label="locStr('Action')"
                v-model="action4Edit"
            ></v-text-field>
            <v-text-field
                light
                class="input-on-card"
                :hint="locStr('State - What is achieved in this step')"
                solo
                dense
                :label="locStr('Description')"
                ref="stateField"
                v-model="state4Edit"
            ></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn light text @click="saveData">
                {{ locStr("Save") }}
            </v-btn>
            <v-btn light text @click="cancelSaving">
                {{ locStr("Cancel") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import { locStr } from "@/utilities";
export default Vue.extend({
    name: "MangoFpEditStep",
    props: {
        code: {
            type: String,
        },
        action: {
            type: String,
        },
        state: {
            type: String,
        },
    },
    data() {
        return {
            code4Edit: this.code || "",
            action4Edit: this.action || "",
            state4Edit: this.state || "",
        };
    },
    mounted() {
        let focusedEdit = this.$refs.stateField as HTMLInputElement;
        if (!this.code) {
            focusedEdit = this.$refs.codeField as HTMLInputElement;
        }

        if (focusedEdit) {
            focusedEdit.focus();
        }
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
        saveData() {
            this.$emit("add", {
                code: this.code4Edit.toUpperCase(),
                action: this.action4Edit,
                state: this.state4Edit,
            });
        },
        cancelSaving() {
            this.code4Edit = this.code;
            this.action4Edit = this.action;
            this.state4Edit = this.state;
            this.$emit("close");
        },
    },
});
</script>
<style>
.input-on-card input[type="text"]:focus {
    box-shadow: 0 0 0 1px #ffffff;
}

.input-on-card {
    border-color: white;
    outline-style: none;
}

.input-on-card div {
    border-color: white !important;
    outline-style: none;
}

.input-on-card input {
    border-style: none;
    outline-style: none;
    border-color: white !important;
}

.step-code input {
    text-transform: uppercase;
}

.step-code-boilerplate {
    color: black;
    padding-bottom: 10px;
}
</style>
