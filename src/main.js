// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import router from './router'
import Vuetify from "vuetify"
import 'vuetify/dist/vuetify.min.css'
// main.js
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/es5/util/colors'
import axios from 'axios'
import qs from 'qs'

Vue.prototype.qs = qs;
Vue.prototype.axios = axios;
axios.defaults.withCredentials = true
Vue.config.productionTip = false;
Vue.use(Vuetify, {
  theme: {
    primary: "#2196F3",
    secondary: "#455A64",
    accent: "#9c27b0",
    error: "#f44336",
    warning: "#FFC107",
    info: "#64B5F6",
    success: "#4caf50"
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
