import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import store from './store'
import router from './router'
import './index.css'
import App from './app.vue'

// always uses Node.js http adapter in axios. See https://github.com/axios/axios/issues/552
axios.defaults.adapter = require('axios/lib/adapters/http')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

document.title = 'PYRO'
