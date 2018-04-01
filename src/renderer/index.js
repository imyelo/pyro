import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import store from './store'
import router from './router'
import './index.css'
import App from './app.vue'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

document.title = 'PYRO'
