import { createApp } from "vue";
import App from "./App.vue";

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import initMoment from "./core/plugins/moment";
import "@/core/plugins/yup";
import { vue3Debounce } from "vue-debounce";
import VueVideoPlayer from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
import trTR from "element-plus/dist/locale/tr.mjs";
const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus, {
  locale: trTR,
});
app.directive("debounce", vue3Debounce({ lock: true }));
ApiService.init();
initApexCharts(app);
initInlineSvg(app);
initVeeValidate();
initMoment();
app.use(i18n);
app.use(VueVideoPlayer);
app.use(FloatingVue);

app.directive("click-outside", {
  mounted(el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

app.mount("#app");
