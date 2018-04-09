import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import store from './store'
import router from './router'
import './index.css'
import App from './app.vue'
import ports from '../common/ports'

// always uses Node.js http adapter in axios. See https://github.com/axios/axios/issues/552
axios.defaults.adapter = require('axios/lib/adapters/http')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

document.title = 'PYRO'

ports.on('data', (port, data) => {
  store.dispatch('log', { type: 'info', message: `Received a message from [${port.path}]: ${data.toString()}` })
})
ports.on('end', (port) => {
  store.dispatch('log', { type: 'info', message: `Received a serial port ending event from [${port.path}].` })
})
ports.on('error', (port, error) => {
  store.dispatch('log', { type: 'info', message: `Received an error from [${port.path}]: ${error.message}` })
})
ports.on('close-all', ({ count }) => {
  store.dispatch('log', { type: 'info', message: `${count} ports closed.` })
})
