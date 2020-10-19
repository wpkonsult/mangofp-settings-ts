<template>
    <v-card dark color="#f1f1f1">
        <v-card-text>
            <v-text-field
                v-if="!code"
                light
                class="input-on-card step-code"
                :hint="
                    locStr(
                        'Code - Id for this step of process - have to be unique',
                    )
                "
                solo
                dense
                :label="locStr('Code')"
                ref="codeField"
                v-model="code4Edit"
            ></v-text-field>
            <div v-else class="font-weight-normal step-code-boilerplate">
                <strong>{{ code }}</strong>
            </div>

            <v-text-field
                light
                class="input-on-card"
                :hint="locStr('Description - What is achieved in this step')"
                solo
                dense
                :label="locStr('Description')"
                ref="nameField"
                v-model="description4Edit"
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
        description: {
            type: String,
        },
    },
    data() {
        return {
            code4Edit: this.code || "",
            description4Edit: this.description || "",
        };
    },
    mounted() {
        let focusedEdit = this.$refs.nameField as HTMLInputElement;
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
            console.log(
                `About to save data code: ${this.code4Edit}, description: ${this.description4Edit}`,
            );
            this.$emit("add", {
                code: this.code4Edit.toUpperCase(),
                name: this.description4Edit,
            });
        },
        cancelSaving() {
            console.log("About to cancel saving and will emit ... ");
            this.$emit("close", "test");
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
