import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router/index';
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(PerfectScrollbar)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
