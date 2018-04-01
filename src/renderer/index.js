import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import router from './router'
import './index.css'
import App from './app.vue'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

document.title = 'PYRO'
