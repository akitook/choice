export default {
  START_LOGIN: state => {
    state.user = {
      ...state.user,
      isLogging: true
    }
  },
  SUCCESS_LOGIN: (state, data) => {
    state.user = {
      ...state.user,
      isLogging: false,
      data: data
    }
  },
  FAILED_LOGIN: state => {
    state.user = {
      isLogging: false,
      data: null
    }
  },
  LOGOUT: state => {
    state.user = {
      isLogging: false,
      data: null
    }
  },
  SUCCESS_FETCH_QUESTIONS: (state, res) => {
    state.questions = res
  },
  SUCCESS_FETCH_MORE_QUESTIONS: (state, res) => {
    state.questions = {
      records: [...state.questions.records, ...res.records],
      lastVisible: res.lastVisible
    }
  },
  SUCCESS_FETCH_USER_QUESTIONS: (state, res) => {
    state.userQuestions = res
  },
  FAILED_FETCH_USER_QUESTIONS: (state, err) => {},
  FAILED_FETCH_QUESTIONS: (state, err) => {},
  SUCCESS_UPDATE_CARD: state => {},
  FAILED_UPDATE_CARD: state => {},
  SUCCESS_UPDATE_USER_ANSWER: state => {},
  FAILED_UPDATE_USER_ANSWER: state => {},
  INIT_POST_FORM: state => {
    state.post = {
      data: null,
      isSave: false,
      isInInput: true
    }
  },
  SUCCESS_POST_QUESTION: (state, data) => {
    //投稿中のポストデータに格納
    state.post = {
      ...state.post,
      data,
      isInInput: false
    }
  },
  FAILED_POST_QUESTION: state => {},
  SUCCESS_UPLOAD_IMAGE: state => {
    state.post = {
      ...state.post
    }
  },
  FAILED_UPLOAD_IMAGE: state => {},
  COMPLETE_UPLOAD_IMAGE: state => {
    state.post = {
      ...state.post,
      isSave: true,
      isInInput: false
    }
  }
}
