import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import init from '../config/firebase-init'

if (!firebase.apps.length) {
  firebase.initializeApp(init)
}

export const providerGoogle = new firebase.auth.GoogleAuthProvider()
export const providerTwitter = new firebase.auth.TwitterAuthProvider()

export default firebase
