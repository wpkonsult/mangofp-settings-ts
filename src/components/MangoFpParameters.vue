<template>
    <v-sheet background-color="transparent" color="basil" elevation="0">
        <v-container class="pa-0">
            <v-row no-gutters>
                <v-col>
                    <v-card class="pl-5 pb-5">
                        <v-card-title>
                            {{ locStr("General parameters") }}
                        </v-card-title>
                        <v-card-text> </v-card-text>
                        <v-row
                            v-for="param in data4Edit"
                            :key="param.label"
                            class="pa-6"
                        >
                            <v-col cols="3" sm="2">
                                <h3>
                                    {{ param.name }}
                                </h3>
                            </v-col>
                            <v-col cols="8" sm="7" md="5" lg="4">
                                <v-text-field
                                    v-if="param.type == 'TEXT'"
                                    light
                                    class="input-on-card"
                                    solo
                                    dense
                                    @focus="onFocus"
                                    v-model="param.value"
                                ></v-text-field>
                                <v-text-field
                                    v-else-if="param.type == 'EMAIL'"
                                    light
                                    class="input-on-card"
                                    solo
                                    dense
                                    v-model="param.value"
                                    :error="!!param.errorMsg"
                                    :error-messages="param.errorMsg"
                                    @blur="validateEmailElem(param)"
                                    @focus="clearEmailElemErrorMsg(param)"
                                ></v-text-field>
                                <div v-else>
                                    {{
                                        locStr("Unknown field type: ") +
                                            param.type
                                    }}
                                </div>
                                <div v-html="param.hint"></div>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-btn
                                outlined
                                text
                                @click="saveParameters"
                                :disabled="confirmDisabled"
                            >
                                {{ locStr("Confirm") }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>
<script lang="ts">
import Vue from "vue";
import { Parameter } from "@/types";
import { locStr, validateEmail } from "@/utilities";
import * as Actions from "@/actions";
import { dataStore } from "@/main";

export default Vue.extend({
    name: "MangoFpParameters",
    components: {},
    data() {
        return {
            data4Edit: [] as Parameter[],
            parameters: dataStore.state.parameters,
            confirmDisabled: true,
        };
    },
    async mounted() {
        this.confirmDisabled = true;
        await Actions.getAllOptions();
        this.confirmDisabled = false;
    },
    watch: {
        parameters() {
            for (let i = 0; i < this.parameters.length; i++) {
                this.data4Edit.splice(i, 1, { ...this.parameters[i] });
            }
        },
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },

        getNewParam4Edit() {
            return {
                value: "",
                type: "string",
                name: "",
            };
        },

        async saveParameters() {
            const notValidParam = this.data4Edit.find(elem => elem.errorMsg);
            if (notValidParam) {
                return false;
            }

            const changedParams = this.data4Edit.filter((param, i) => {
                return param.value !== this.parameters[i].value;
            });

            if (changedParams.length) {
                this.confirmDisabled = true;
                await Actions.updateOptions(changedParams);
                this.confirmDisabled = false;
            }
        },

        onFocus() {
            Actions.clearGeneralMessage();
        },
        validateEmailElem(emailParam: Parameter) {
            if (!validateEmail(emailParam.value)) {
                emailParam.errorMsg = locStr("Email format is not correct");
                return;
            }
            emailParam.errorMsg = "";
        },
        clearEmailElemErrorMsg(emailParam: Parameter) {
            this.onFocus();
            emailParam.errorMsg = "";
        },
    },
});
</script>
<style>
.parameters {
    width: 100%;
}
</style>
