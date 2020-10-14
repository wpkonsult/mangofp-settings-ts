<template>
    <v-card class="pa-5" flat>
        <v-card-title>
            {{ locStr("Switch on new states for ") }}"{{ state.state }}"
        </v-card-title>
        <v-card-text>
            <div v-for="elem in nextStates" :key="elem.value">
                <v-switch
                    v-model="state.next"
                    inset
                    :label="elem.text"
                    :value="elem.value"
                ></v-switch>
            </div>
        </v-card-text>
    </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import { locStr } from "@/utilities";
export default Vue.extend({
    props: {
        state: {
            type: Object,
            required: true,
        },

        nextStates: {
            type: Array,
            required: true,
        },
    },
    methods: {
        locStr: function(key: string): string {
            return locStr(key);
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
</style>
