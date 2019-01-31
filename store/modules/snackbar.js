const state = {
  isShow: false,
  message: '',
  type: 'info'
}

const getters = {}

const actions = {
  showSnackbar({ dispatch, commit }, payload) {
    //payload: {type, message}
    commit('SHOW_SNACKBAR', payload)
  }
}

const mutations = {
  SHOW_SNACKBAR: (state, payload) => {
    state.isShow = true
    state.message = payload.message
    state.type = payload.type
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
