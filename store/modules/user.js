import firebase from '../../api/firebase'

const state = {
  isLogging: false,
  isSaving: false,
  isSavingAuth: false,
  data: null,
  info: {
    birthYear: null,
    created: null,
    sex: null
  },
  questions: []
}

const getters = {}

const actions = {
  setNewUser({ commit }, data) {
    firebase
      .setNewUser(data)
      .then(_ => {
        commit('SUCCESS_SET_NEW_USER')
      })
      .catch(err => {
        console.log(err)
        commit('FAILED_SET_NEW_USER')
      })
  },
  updateUser({ dispatch, commit }, data) {
    //data: { displayName, sex, birthYear, userData}
    commit('START_UPDATE_USER')
    dispatch('updateAuth', data)
    firebase
      .updateUser(data)
      .then(res => {
        //res: { displayName, sex, birthYear }
        commit('SUCCESS_UPDATE_USER', res)
        dispatch(
          'snackbar/showSnackbar',
          {
            type: 'info',
            message: 'プロフィールを保存しました'
          },
          { root: true }
        )
      })
      .catch(err => {
        console.log(err)
        commit('FAILED_UPDATE_USER')
        dispatch(
          'snackbar/showSnackbar',
          {
            type: 'error',
            message: '問題が発生しました'
          },
          { root: true }
        )
      })
  },
  updateAuth({ commit }, data) {
    commit('START_UPDATE_AUTH')
    //将来的にはAuthentication情報すべてを変更可能に
    firebase
      .updateAuth(data)
      .then(res => {
        //res: { displayName, sex, birthYear }
        commit('SUCCESS_UPDATE_AUTH', res)
      })
      .catch(err => {
        console.log(err)
        commit('FAILED_UPDATE_AUTH')
      })
  },
  login({ dispatch, commit }, type) {
    commit('START_LOGIN')
    firebase
      .login(type)
      .then(data => {
        commit('SUCCESS_LOGIN', data)
        data.isNewUser ? dispatch('setNewUser', data) : null
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
    firebase.getAuth().then(data => {
      if (!data) {
        commit('FAILED_LOGIN')
        dispatch('questions/fetchQuestions', '', { root: true })
      } else {
        commit('SUCCESS_LOGIN', data)
        dispatch('fetchUser', data.uid)
        dispatch('questions/fetchQuestions', data, { root: true })
      }
    })
  },
  fetchUser({ dispatch, commit }, userId) {
    firebase.getUser(userId).then(info => {
      if (!info) {
        commit('FAILED_FETCH_USER')
      } else {
        commit('SUCCESS_FETCH_USER', info)
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
  FAILED_FETCH_USER_QUESTIONS: (state, err) => {},
  SUCCESS_SET_NEW_USER: state => {},
  FAILED_SET_NEW_USER: state => {},
  START_UPDATE_USER: state => {
    state.isSaving = true
  },
  SUCCESS_UPDATE_USER: (state, data) => {
    state.data.displayName = data.displayName
    state.data.sex = info.sex
    state.data.birthYear = info.birthYear
    state.data.isNewUser = false
    state.isSaving = false
  },
  FAILED_UPDATE_USER: state => {
    state.isSaving = false
  },
  START_UPDATE_AUTH: state => {
    state.isSavingAuth = true
  },
  SUCCESS_UPDATE_AUTH: state => {
    state.isSavingAuth = false
  },
  FAILED_UPDATE_AUTH: state => {
    state.isSavingAuth = false
  },
  SUCCESS_FETCH_USER: (state, info) => {
    console.log(info)
    state.info.birthYear = info.birthYear
    state.info.created = info.created
    state.info.sex = info.sex
  },
  FAILED_FETCH_USER: state => {}
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
