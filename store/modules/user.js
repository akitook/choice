import firebase from '../../api/firebase'

const state = {
  isLogging: false,
  data: null,
  questions: []
}

const getters = {}

const actions = {
  login({ dispatch, commit }, type) {
    commit('START_LOGIN')
    firebase
      .login(type)
      .then(data => {
        commit('SUCCESS_LOGIN', data)
      })
      .catch(errMessage => {
        commit('FAILED_LOGIN', errMessage)
      })
  },
  logout({ commit }) {
    firebase.logout().then(
      _ => {
        commit('LOGOUT')
      },
      err => {}
    )
  },
  fetchStatus({ dispatch, commit }) {
    commit('START_LOGIN')
    firebase.getUser().then(data => {
      if (!data) {
        commit('FAILED_LOGIN')
      } else {
        commit('SUCCESS_LOGIN', data)
      }
    })
  },
  fetchUserQuestions({ dispatch, commit }, userId) {
    firebase
      .fetchUserQuestions(userId)
      .then(res => {
        console.log(res)
        commit('SUCCESS_FETCH_USER_QUESTIONS', res)
      })
      .catch(err => {
        console.log(err)
        commit('FAILED_FETCH_USER_QUESTIONS')
      })
  }
}

const mutations = {
  START_LOGIN: state => {
    state.isLogging = true
  },
  SUCCESS_LOGIN: (state, data) => {
    state.isLogging = false
    state.data = data
  },
  FAILED_LOGIN: state => {
    state.isLogging = false
    state.data = null
    state.questions = null
  },
  LOGOUT: state => {
    state.isLogging = false
    state.data = null
    state.questions = null
  },
  SUCCESS_FETCH_USER_QUESTIONS: (state, res) => {
    state.questions = res
  },
  FAILED_FETCH_USER_QUESTIONS: (state, err) => {}
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
