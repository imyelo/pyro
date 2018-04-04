import Vuex, { Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Vue from 'vue'
import km from 'keymirror'
import ElectronStore from 'electron-store'
import axios from 'axios'

const electronStore = new ElectronStore({ name: 'pyro' })

const MUTATION = km({
  LOG_ADD: null,
  CLEAR_LOGS: null,
  COM_SET: null,
  DEVICES_SET: null,
  AUTO_BURN_SET: null,
  ADAPTER_SET: null,
})

const DEFAULT_LOG = { type: 'verbose', message: 'Hello World!' }

Vue.use(Vuex)

export default new Store({
  plugins: [createPersistedState({
    storage: {
      getItem: (key) => electronStore.get(key),
      setItem: (key, value) => electronStore.set(key, value),
      removeItem: (key) => electronStore.delete(key),
    },
  })],
  state: {
    devices: [],
    com: '',
    logs: [DEFAULT_LOG],
    isAutoBurn: false,
    adapter: {
      url: 'https://pastebin.com/raw/M0rNhW6h',
      code: require('raw-loader!./adapters/default.js'),
    },
  },
  mutations: {
    [MUTATION.LOG_ADD] (state, log) {
      state.logs.push(log)
    },
    [MUTATION.CLEAR_LOGS] (state, log) {
      state.logs = [DEFAULT_LOG]
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
    [MUTATION.ADAPTER_SET] (state, { url, code }) {
      state.adapter = { url, code }
    },
  },
  actions: {
    log ({ commit }, data) {
      commit(MUTATION.LOG_ADD, data)
    },
    clearLogs ({ commit }) {
      commit(MUTATION.CLEAR_LOGS)
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
    setAdapter ({ commit }, adapter) {
      commit(MUTATION.ADAPTER_SET, adapter)
    },
  }
})
