import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import post from './modules/post'
import question from './modules/question'
import questions from './modules/questions'
import snackbar from './modules/snackbar'
Vue.use(Vuex)

const store = () => {
  return new Vuex.Store({
    modules: {
      user,
      post,
      question,
      questions,
      snackbar
    }
  })
}

export default store
