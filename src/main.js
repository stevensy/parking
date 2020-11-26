import './permission'; // permission control
import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue';

import ElementUI from 'element-ui';

import App from './App.vue';
import router from './router';
import store from './store';
import {
  parseTime,
  resetForm,
} from './utils/index';

Vue.prototype.resetForm = resetForm
Vue.prototype.parseTime = parseTime
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
