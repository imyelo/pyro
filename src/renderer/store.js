import Vuex, { Store } from 'vuex'
import Vue from 'vue'
import km from 'keymirror'

Vue.use(Vuex)

const MUTATION = km({
  LOG_ADD: null,
  COM_SET: null,
  DEVICES_SET: null,
  AUTO_BURN_SET: null,
})

export default new Store({
  state: {
    devices: [],
    com: '',
    logs: [{ type: 'verbose', message: 'Ready' }],
    isAutoBurn: false,
  },
  mutations: {
    [MUTATION.LOG_ADD] (state, log) {
      state.logs.push(log)
    },
    [MUTATION.COM_SET] (state, com) {
      state.com = com
    },
    [MUTATION.DEVICES_SET] (state, devices) {
      state.devices = devices
    },
    [MUTATION.AUTO_BURN_SET] (state, value) {
      state.isAutoBurn = value
    },
  },
  actions: {
    log ({ commit }, data) {
      commit(MUTATION.LOG_ADD, data)
    },
    setCom ({ commit }, com) {
      commit(MUTATION.COM_SET, com)
    },
    setDevices ({ commit }, devices) {
      commit(MUTATION.DEVICES_SET, devices)
    },
    setAutoBurn ({ commit }, value) {
      commit(MUTATION.AUTO_BURN_SET, value)
    },
  }
})
