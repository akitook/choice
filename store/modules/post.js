import firebase from '../../api/firebase'
import firestorage from '../../api/firestorage'

const state = {
  data: null,
  isSave: false,
  isInInput: false
}

const getters = {}

const actions = {
  initPostForm({ commit }) {
    commit('INIT_POST_FORM')
  },

  postQuestion({ dispatch, commit }, payload) {
    //payload {title, images, user}
    commit('START_POST_QUESTION')
    firebase
      .postQuestion(payload)
      .then(data => {
        dispatch('uploadImages', {
          images: payload.images,
          question_id: data.id
        })
        commit('SUCCESS_POST_QUESTION', data)
      })
      .catch(errMessage => {
        console.log(errMessage)
        commit('FAILED_POST_QUESTION')
      })
  },
  uploadImages({ dispatch, commit }, payload) {
    // payload {images, question_id}
    let uploadfuncs = []
    const imagesNumber = payload.images.length
    for (let i = 0; i < imagesNumber; i++) {
      const imageData = payload.images[i]
      const imageName = payload.question_id + '_' + i
      uploadfuncs.push(firestorage.uploadImage(imageData, imageName))
    }
    Promise.all(uploadfuncs)
      .then(_ => {
        commit('COMPLETE_UPLOAD_IMAGE')
        this.$router.push(`/card/${payload.question_id}`)
      })
      .catch(err => {
        commit('FAILED_UPLOAD_IMAGE')
      })
  }
}

const mutations = {
  INIT_POST_FORM: state => {
    state.data = null
    state.isSave = false
    state.isInInput = true
  },
  START_POST_QUESTION: state => {
    state.isInInput = false
  },
  SUCCESS_POST_QUESTION: (state, data) => {
    //投稿中のポストデータに格納
    state.data = data
  },
  FAILED_POST_QUESTION: state => {},
  SUCCESS_UPLOAD_IMAGE: state => {},
  FAILED_UPLOAD_IMAGE: state => {},
  COMPLETE_UPLOAD_IMAGE: state => {
    state.isSave = true
    state.isInInput = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
