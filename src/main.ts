import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router/index';
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import vueDropdown from './components/common/vueDropdown.vue'
import { Sketch } from 'vue-color';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import App from './App.vue'

(window as any).resizeScrollbar = (proxy: any, object: string, scrollbar: string, callback?: Function) => {
  Vue.nextTick(() => {
    proxy?.[object]?.contentWindow.addEventListener('resize', () => {
      proxy?.[scrollbar]?.update();
      callback?.();
    });
  });
};

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(PerfectScrollbar)
Vue.component('vueDropdown', vueDropdown)
Vue.component('sketchPicker', Sketch)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
