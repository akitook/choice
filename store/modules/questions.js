import firebase from '../../api/firebase'

const state = {
  records: []
}

const getters = {}

const actions = {
  fetchQuestions({ dispatch, commit }, userData) {
    const isLogin = !!userData
    console.log(isLogin)
    dispatch('clearQuestions')
    firebase
      .fetchQuestions(userData)
      .then(res => {
        commit('SUCCESS_FETCH_QUESTIONS', res)
      })
      .catch(err => {
        console.log(err)
        commit('FAILED_FETCH_QUESTIONS')
      })
  },

  clearQuestions({ commit }) {
    commit('CLEAR_QUESTIONS')
  },

  updateAnswer({ dispatch, commit }, payload) {
    console.log(payload)
    //payload {card, approval, user, index}
    firebase
      .updateAnswer(payload)
      .then(data => {
        commit('SUCCESS_UPDATE_CARD', payload)
      })
      .catch(errMessage => {
        console.log(errMessage)
        commit('FAILED_UPDATE_CARD')
      })
  },

  updateUserAnswer({ dispatch, commit }, payload) {
    //payload {card, approval, user}
    firebase
      .updateUserAnswer(payload)
      .then(data => {
        commit('SUCCESS_UPDATE_USER_ANSWER')
      })
      .catch(errMessage => {
        console.log(errMessage)
        commit('FAILED_UPDATE_USER_ANSWER')
      })
  }
}

const mutations = {
  SUCCESS_FETCH_QUESTIONS: (state, res) => {
    const mergeRecords = state.records.concat(res.records)
    state.records = mergeRecords
  },
  SUCCESS_FETCH_MORE_QUESTIONS: (state, res) => {
    state.records = [state.records, res.records]
  },
  FAILED_FETCH_QUESTIONS: (state, err) => {},
  SUCCESS_UPDATE_CARD: (state, res) => {
    state.records[res.index].choice.total++
    res.approval === 'a'
      ? state.records[res.index].choice.one.total++
      : state.records[res.index].choice.two.total++
  },
  FAILED_UPDATE_CARD: state => {},
  SUCCESS_UPDATE_USER_ANSWER: state => {},
  FAILED_UPDATE_USER_ANSWER: state => {},
  CLEAR_QUESTIONS: state => {
    state.records = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
