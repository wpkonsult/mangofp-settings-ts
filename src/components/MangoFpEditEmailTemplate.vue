<template>
    <div>
        <v-card v-if="loaded" class="pa-0" flat>
            <v-card-text>
                <v-text-field
                    class="step-text-field"
                    solo
                    :label="locStr('Primary addresses')"
                    :hint="
                        locStr(
                            'Primary addresses for emails. [contactEmail] - is an email on submitted form',
                        )
                    "
                    v-model="mainAddressesAsString"
                    :error="!mainAddressesAreValid"
                    :error-messages="mainAddressesValidationError"
                ></v-text-field>
                <v-text-field
                    class="step-text-field"
                    solo
                    :label="locStr('CC Addresses')"
                    :hint="locStr('CC addresses for archiving options')"
                    v-model="addressesAsString"
                    :error="!addressesAreValid"
                    :error-messages="addressesValidationError"
                ></v-text-field>
                <v-textarea
                    solo
                    rows="10"
                    full-width
                    v-model="email4Edit"
                    hint="Template of the email to be sent to the contact when action of this step is executed"
                >
                </v-textarea>
            </v-card-text>
            <v-card-actions class="pl-0" color="">
                <v-btn outlined text @click="saveTemplate">
                    {{ locStr("Confirm") }}
                </v-btn>
                <v-btn outlined text @click="cancelTemplate">
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
import { loadTemplate } from "@/actions";
export default Vue.extend({
    name: "MangoFpEditEmailTemplate",
    props: {
        code: {
            type: String,
        },
        addresses: {
            type: Array,
        } as Vue.PropOptions<string[]>,
        mainAddresses: {
            type: Array,
        } as Vue.PropOptions<string[]>,
        templateText: {
            type: String,
        },
        loaded: {
            type: Boolean,
        },
        showLoader: {
            type: Boolean,
        },
        state: {
            type: Object,
        },
    },
    data() {
        return {
            email4Edit: "",
            addressesAsString: "",
            mainAddressesAsString: "",
            addressesAreValid: true,
            addressesValidationError: "",
            mainAddressesAreValid: true,
            mainAddressesValidationError: "",
            absolute: true,
        };
    },
    mounted() {
        console.log("MangoFpEditTemplate mounted. Code: " + this.code);
        this.addressesAsString = this.getAddressesAsString(this.addresses);
        this.mainAddressesAsString = this.getAddressesAsString(
            this.mainAddresses,
        );
        loadTemplate(this.code);
    },
    watch: {
        addresses: function() {
            this.addressesAsString = this.getAddressesAsString(this.addresses);
        },
        mainAddresses: function() {
            this.mainAddressesAsString = this.getAddressesAsString(
                this.mainAddresses,
            );
        },
        templateText: function() {
            this.email4Edit = this.templateText;
        },
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
        },

        getAddressesAsString: function(addresses: string[]): string {
            return addresses.join("; ") as string;
        },

        stringAsAddresses: function(addressesString: string): string[] {
            return addressesString.split(";").map((e: string) => e.trim());
        },

        resetErrors() {
            this.addressesAreValid = true;
            this.mainAddressesAreValid = true;
            this.addressesValidationError = "";
            this.mainAddressesValidationError = "";
            return true;
        },

        validateAndGetEmailAddresses(addresses: string[]): string[] {
            const specials = ["[contactEmail]"];
            const emails = addresses.map((elem: string) => {
                const email = elem.trim();
                if (!email) {
                    return "";
                }

                if (specials.includes(email)) {
                    return email;
                }

                const RegValidate = /([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
                if (!RegValidate.test(email)) {
                    throw new Error(
                        email + " " + this.locStr("is not proper email"),
                    );
                }
                return email;
            });
            return emails.filter((elem: string) => elem);
        },
        saveTemplate() {
            this.resetErrors();

            let addresses4Edit: string[] = this.stringAsAddresses(
                this.addressesAsString,
            );
            let mainAddresses4Edit: string[] = this.stringAsAddresses(
                this.mainAddressesAsString,
            );

            try {
                mainAddresses4Edit = this.validateAndGetEmailAddresses(
                    mainAddresses4Edit,
                );
            } catch (err) {
                this.mainAddressesAreValid = false;
                this.mainAddressesValidationError = err.message;
                return false;
            }
            try {
                addresses4Edit = this.validateAndGetEmailAddresses(
                    addresses4Edit,
                );
            } catch (err) {
                this.addressesAreValid = false;
                this.addressesValidationError = err.message;
                return false;
            }

            this.$emit("updateTemplate", {
                code: this.code,
                addresses: addresses4Edit,
                mainAddresses: mainAddresses4Edit,
                templateText: this.email4Edit,
            });
        },
        cancelTemplate() {
            this.addressesAsString = this.getAddressesAsString(this.addresses);
            this.mainAddressesAsString = this.getAddressesAsString(
                this.mainAddresses,
            );
            this.email4Edit = this.templateText;
            this.resetErrors();
            this.$emit("close");
        },
    },
});
</script>
