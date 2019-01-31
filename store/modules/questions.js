import firebase from '../../api/firebase'

const state = {
  records: null,
  lastVisible: null
}

const getters = {}

const actions = {
  fetchQuestions({ dispatch, commit }, user) {
    firebase
      .fetchQuestions(user)
      .then(res => {
        console.log(res)
        commit('SUCCESS_FETCH_QUESTIONS', res)
      })
      .catch(err => {
        console.log(err)
        commit('FAILED_FETCH_QUESTIONS')
      })
  },
  updateAnswer({ dispatch, commit }, payload) {
    //payload {card, approval, user}
    firebase
      .updateAnswer(payload)
      .then(data => {
        commit('SUCCESS_UPDATE_CARD')
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
    state.records = res.records
    state.lastVisible = res.lastVisible
  },
  SUCCESS_FETCH_MORE_QUESTIONS: (state, res) => {
    state.records = {
      ...state.records,
      ...res.records
    }
    state.lastVisible = {
      ...state.lastVisible,
      ...res.lastVisible
    }
  },
  FAILED_FETCH_QUESTIONS: (state, err) => {},
  SUCCESS_UPDATE_CARD: state => {},
  FAILED_UPDATE_CARD: state => {},
  SUCCESS_UPDATE_USER_ANSWER: state => {},
  FAILED_UPDATE_USER_ANSWER: state => {}
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
