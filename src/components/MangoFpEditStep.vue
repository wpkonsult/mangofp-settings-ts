<template>
    <v-card dark color="#f1f1f1">
        <v-card-text>
            <v-text-field
                light
                class="input-on-card"
                :hint="
                    locStr(
                        'Code - Id for this step of process - have to be unique',
                    )
                "
                solo
                dense
                :label="locStr('Code')"
                v-model="code4Edit"
            ></v-text-field>

            <v-text-field
                light
                class="input-on-card"
                :hint="locStr('Description - What is achieved in this step')"
                solo
                dense
                :label="locStr('Description')"
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
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },
        saveData() {
            console.log(
                `About to save data code: ${this.code4Edit}, description: ${this.description4Edit}`,
            );
            this.$emit("add", {
                code: this.code4Edit,
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
</style>
