import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import * as Store from "@/store";

Vue.config.productionTip = false;
export const bus = new Vue();
export const dataStore: Store.Type = Store.makeStore(bus, true);

new Vue({
    vuetify,
    render: h => h(App),
}).$mount("#app");
