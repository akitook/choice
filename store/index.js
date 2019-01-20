import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const store = () => {
  return new Vuex.Store({
    state: {
      device: null,
      user: {
        isLogging: false,
        data: null
      },
      questions: {
        records: null,
        lastVisible: null
      }
    },
    actions,
    mutations,
    getters
  })
}

export default store
