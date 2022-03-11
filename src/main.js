import Vue from "vue";
import VueCompositionApI from "@vue/composition-api";
import VueCodePreview from "./vue-code-preview";

/// components
import TButton from "@/components/t-button";
import TTag from "@/components/t-tag";

import "./assets/tailwind.css";

Vue.use(VueCompositionApI);

Vue.component(TButton.name, TButton);
Vue.component(TTag.name, TTag);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(VueCodePreview),
}).$mount("#app");
