<template>
    <div id="app">
        <v-app>
            <v-content>
                <v-container fluid>
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
