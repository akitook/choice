import firebase from '../../api/firebase'

const state = {
  data: null
}

const getters = {}

const actions = {
  setQuestion({ dispatch, commit }, questionData) {
    commit('SET_QUESTION', questionData)
  },
  fetchQuestionById({ dispatch, commit }, id) {
    firebase
      .fetchQuestion(id)
      .then(res => {
        console.log(res)
        commit('SUCCESS_FETCH_QUESTION')
        dispatch('setQuestion', res)
      })
      .catch(err => {
        console.log(err)
        commit('FAILED_FETCH_QUESTION')
      })
  },
  deleteQuestion({ dispatch, commit }, id) {
    firebase
      .deleteQuestion(id)
      .then(res => {
        commit('SUCCESS_DELETE_QUESTION')
        dispatch(
          'snackbar/showSnackbar',
          {
            type: 'info',
            message: '質問を削除しました'
          },
          { root: true }
        )
      })
      .catch(err => {
        commit('FAILED_DELETE_QUESTION')
        dispatch(
          'snackbar/showSnackbar',
          {
            type: 'error',
            message: '問題が発生しました'
          },
          { root: true }
        )
      })
  }
}

const mutations = {
  SET_QUESTION: (state, res) => {
    state.data = res
  },
  SUCCESS_FETCH_QUESTION: (state, res) => {},
  FAILED_FETCH_QUESTION: (state, err) => {},
  SUCCESS_DELETE_QUESTION: (state, res) => {},
  FAILED_DELETE_QUESTION: (state, err) => {}
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
