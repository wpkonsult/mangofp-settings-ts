<template>
    <v-card flat max-width="600">
        <div>
            <v-card-title>
                {{ state.state }}
            </v-card-title>
        </div>
        <v-select
            chips
            multiple
            solo
            :items="nextStates"
            v-model="state.next"
            :label="locStr('Next states')"
        ></v-select>
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
