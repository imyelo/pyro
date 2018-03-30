import Vuex, { Store } from 'vuex'
import Vue from 'vue'
import km from 'keymirror'

Vue.use(Vuex)

const MUTATION = km({
  LOG_ADD: null,
})

export default new Store({
  state: {
    devices: [],
    com: '',
    logs: ['111', '333'],
  },
  mutation: {
    [MUTATION.LOG_ADD] (state, log) {
      state.logs.push(log)
    }
  },
  actions: {
    log ({ commit }, data) {
      commit(MUTATION.LOG_ADD, data)
    },
  }
})
