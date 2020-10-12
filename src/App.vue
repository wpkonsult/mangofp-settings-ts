<template>
    <div id="app">
        <v-app class="main">
            <v-content>
                <v-container fluid class="pa-0">
                    <MangoFpSettingsMain />
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>
<script>
import MangoFpSettingsMain from "./components/MangoFpSettingsMain";
export default {
    name: "App",
    components: {
        MangoFpSettingsMain,
    },
};
</script>
<style src="@/styles/global.css"></style>
