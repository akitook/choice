import firebase from '../api/firebase'
import firestorage from '../api/firestorage'

export const login = ({ dispatch, commit }, type) => {
  commit('START_LOGIN')
  firebase
    .login(type)
    .then(data => {
      commit('SUCCESS_LOGIN', data)
    })
    .catch(errMessage => {
      commit('FAILED_LOGIN', errMessage)
    })
}

export const logout = ({ commit }) => {
  firebase.logout().then(
    _ => {
      commit('LOGOUT')
    },
    err => {}
  )
}

export const fetchStatus = ({ dispatch, commit }) => {
  commit('START_LOGIN')
  firebase.getUser().then(data => {
    if (!data) {
      commit('FAILED_LOGIN')
    } else {
      commit('SUCCESS_LOGIN', data)
    }
  })
}

export const fetchQuestions = ({ dispatch, commit }, user) => {
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
}

export const fetchUserQuestions = ({ dispatch, commit }, userId) => {
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

export const updateAnswer = ({ dispatch, commit }, payload) => {
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
}

export const updateUserAnswer = ({ dispatch, commit }, payload) => {
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

export const postQuestion = ({ dispatch, commit }, payload) => {
  //payload {title, images, user}
  firebase
    .postQuestion(payload)
    .then(data => {
      dispatch('uploadImages', { images: payload.images, question_id: data.id })
      commit('SUCCESS_POST_QUESTION')
    })
    .catch(errMessage => {
      console.log(errMessage)
      commit('FAILED_POST_QUESTION')
    })
}

export const uploadImages = ({ dispatch, commit }, payload) => {
  // payload {images, question_id}
  for (let i = 0; i < payload.images.length; i++) {
    const imageData = payload.images[i]
    const imageName = payload.question_id + '_' + i
    firestorage
      .uploadImage(imageData, imageName)
      .then(_ => {
        commit('SUCCESS_UPLOAD_IMAGE')
      })
      .catch(err => {
        commit('FAILED_UPLOAD_IMAGE')
      })
  }
}
