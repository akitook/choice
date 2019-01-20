import firebase, { providerGoogle, providerTwitter } from '~/plugins/firebase'

const firestore = firebase.firestore()

import cloudStorage from './firestorage'

export default {
  fetchQuestions(user) {
    // public: true かつ未回答かつユーザーの質問でない
    const userId = user ? user.uid : '00'
    console.log('user id:' + userId)
    const questionRef = firestore.collection('questions')
    const query = questionRef.where('public', '==', true)
    return new Promise((resolve, reject) => {
      let first_records, second_records, records
      query
        .where('author.uid', '>', userId)
        .get()
        .then(querySnapshot => {
          first_records = querySnapshot.docs.map(elem => elem.data())
          query
            .where('author.uid', '<', userId)
            .get()
            .then(querySnapshot => {
              second_records = querySnapshot.docs.map(elem => elem.data())
              records = first_records.concat(second_records)
              resolve({
                records,
                first_records: first_records,
                second_records: second_records
              })
            })
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fetchQuestionsById(uid) {
    return new Promise((resolve, reject) => {
      firestore
        .collection('questions')
        .doc(uid)
        .get()
        .then(querySnapshot => {
          resolve(querySnapshot.data())
        })
        .catch(err => {
          resolve(err)
        })
    })
  },
  fetchUserQuestions(uid) {
    return new Promise((resolve, reject) => {
      firestore
        .collection('questions')
        .where('user', '==', uid)
        .get()
        .then(querySnapshot => {
          const records = querySnapshot.docs.map(elem => elem.data())
          resolve(records)
        })
        .catch(err => {
          resolve(err)
        })
    })
  },
  getUser() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        let filtered = null
        if (user) {
          filtered = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL
          }
        }
        resolve(filtered)
      })
    })
  },
  login(type) {
    return new Promise(resolve => {
      firebase
        .auth()
        .signInWithPopup(type === 'google' ? providerGoogle : providerTwitter)
        .then(result => {
          const user = result.user
          console.log(user)
          const filtered = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL
          }
          resolve(filtered)
        })
        .catch(err => {
          const errorCode = err.code
          resolve(errorCode)
        })
    })
  },
  logout() {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(_ => {
          resolve()
        })
    })
  },
  postQuestion(payload) {
    return new Promise((resolve, reject) => {
      const created = firebase.firestore.FieldValue.serverTimestamp()
      const ref = firestore.collection('questions').doc()
      console.log(ref)
      const docId = ref.id
      console.log(docId)

      const postContent = {
        id: docId,
        public: true,
        title: payload.title,
        type: 'text',
        author: {
          displayName: payload.user.displayName,
          photoURL: payload.user.photoURL,
          uid: payload.user.uid
        },
        category: 0,
        choice: {
          total: 0,
          one: {
            title: '',
            total: 0,
            url: 'images/' + docId + '_0',
            users: []
          },
          two: {
            title: '',
            total: 0,
            url: 'images/' + docId + '_1',
            users: []
          }
        },
        created: created
      }
      ref
        .set(postContent)
        .then(_ => {
          resolve(postContent)
        })
        .catch(err => {
          console.error('Error adding document: ', err)
          reject(err)
        })
    })
  },
  deleteQuestions(book) {
    return new Promise((resolve, reject) => {
      firestore
        .collection('questions')
        .doc(book.uid)
        .delete()
        .then(docRef => {
          resolve(docRef)
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  },
  updateAnswer(payload) {
    return new Promise((resolve, reject) => {
      const cardData = payload.card
      const approval = payload.approval
      const user = payload.user
      const updateData = approval
        ? {
            'choice.total': cardData.choice.total + 1,
            'choice.one.total': cardData.choice.one.total + 1,
            'choice.one.users': firebase.firestore.FieldValue.arrayUnion(user)
          }
        : {
            'choice.total': cardData.choice.total + 1,
            'choice.two.total': cardData.choice.two.total + 1,
            'choice.two.users': firebase.firestore.FieldValue.arrayUnion(user)
          }
      firestore
        .collection('questions')
        .doc(payload.card.id)
        .update(updateData)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateUserAnswer(payload) {
    return new Promise((resolve, reject) => {
      const cardData = payload.card
      const approval = payload.approval
      const user = payload.user
      const updateUserData = {
        id: cardData.id,
        answer: approval ? 'one' : 'two',
        date: new Date()
      }
      firestore
        .collection('users')
        .doc(payload.user.uid)
        .collection('answers')
        .doc(cardData.id)
        .set(updateUserData)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
