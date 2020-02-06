import firebase, { providerGoogle, providerTwitter } from '~/plugins/firebase'

const firestore = firebase.firestore()

export default {
  fetchQuestions(userData) {
    // public: true かつ未回答かつユーザーの質問でない
    const userId = userData ? userData.uid : '00'
    console.log('user id:' + userId)
    let query = firestore.collection('questions')
    //isPublic
    //query = query.where('public', '==', true)
    //random
    //const randomRefId = firestore.collection('questions').doc().id
    //query = query.where('id', '>', randomRefId)
    // not yet answer one, two
    // query = que.where('choice.one.users.' + userId, '==', false)
    // query = questionsRef.where('choice.two.users.' + userId, '==', false)
    return new Promise((resolve, reject) => {
      //let first_records, second_records, total_records
      function runQuery(i) {
        return new Promise((resolve, reject) => {
          const randomRefId = firestore.collection('questions').doc().id
          query
            .where('id', '>', randomRefId)
            .limit(6)
            .get()
            .then(querySnapshot => {
              let records = querySnapshot.docs.map(elem => elem.data())
              resolve(records)
            })
            .catch(err => {
              reject(err)
            })
        })
      }
      let total_records = []
      function loop(fn, i, end) {
        return fn(i).then(records => {
          total_records = total_records.concat(records)
          if (i < end) {
            return loop(fn, i + 1, end)
          } else {
            return Promise.resolve(total_records)
          }
        })
      }
      loop(runQuery, 0, 2)
        .then(total_records => {
          // 回答済みの質問を除外するfilter
          console.log('before:' + total_records.length)
          const filteredRecords = total_records.filter(
            record =>
              !record.choice.one.users[userId] &&
              !record.choice.two.users[userId]
          )
          console.log('after: ' + filteredRecords.length)
          console.log(filteredRecords)
          resolve({ records: filteredRecords })
        })
        .catch(err => {
          reject(err)
        })
    })
    /*
    query
      .where('author.uid', '<', userId)
      .limit(2)
      .get()
      .then(querySnapshot => {
        second_records = querySnapshot.docs.map(elem => elem.data())
        total_records = first_records.concat(second_records)
        resolve({ records: total_records })
      })
      .catch(err => {
        reject(err)
      })
      */
  },
  fetchQuestion(uid) {
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
        .where('author.uid', '==', uid)
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
  getAuth() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        let filtered = null
        if (user) {
          filtered = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            isNewUser: false
          }
        }
        resolve(filtered)
      })
    })
  },
  getUser(uid) {
    return new Promise((resolve, reject) => {
      firestore
        .collection('users')
        .doc(uid)
        .get()
        .then(querySnapshot => {
          const user = querySnapshot.data()
          let filtered = null
          if (user) {
            filtered = {
              birthYear: user.birthYear,
              created: user.created,
              sex: user.sex
              //modified: user.modified,
            }
          }
          resolve(filtered)
        })
        .catch(err => {
          const errorCode = err.code
          resolve(errorCode)
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
          console.log(result)
          const filtered = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            isNewUser: result.additionalUserInfo.isNewUser
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
  setNewUser(data) {
    return new Promise((resolve, reject) => {
      const created = firebase.firestore.FieldValue.serverTimestamp()
      const ref = firestore.collection('users').doc(data.uid)

      const userData = {
        birthYear: null,
        sex: null,
        uid: data.uid,
        photoURL: data.photoURL,
        displayName: data.displayName,
        created,
        modified: created
      }
      ref
        .set(userData)
        .then(_ => {
          resolve(userData)
        })
        .catch(err => {
          console.error('Error adding document: ', err)
          reject(err)
        })
    })
  },
  updateUser(payload) {
    return new Promise((resolve, reject) => {
      const modified = firebase.firestore.FieldValue.serverTimestamp()
      const displayName = payload.displayName
      const sex = payload.sex
      const birthYear = payload.birthYear
      const userId = payload.userData.uid
      const updateUserData = {
        displayName,
        sex,
        birthYear,
        modified
      }
      firestore
        .collection('users')
        .doc(userId)
        .update(updateUserData)
        .then(res => {
          resolve(updateUserData)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateAuth(payload) {
    return new Promise((resolve, reject) => {
      const displayName = payload.displayName
      const user = firebase.auth().currentUser
      user
        .updateProfile({
          displayName
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
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
            users: {}
          },
          two: {
            title: '',
            total: 0,
            url: 'images/' + docId + '_1',
            users: {}
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
  deleteQuestion(id) {
    return new Promise((resolve, reject) => {
      firestore
        .collection('questions')
        .doc(id)
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
      let choiceData =
        approval === 'a'
          ? {
              'choice.total': cardData.choice.total + 1,
              'choice.one.total': cardData.choice.one.total + 1
            }
          : {
              'choice.total': cardData.choice.total + 1,
              'choice.two.total': cardData.choice.two.total + 1
            }
      let usersData = {}
      if (user) {
        const userId = user.uid
        usersData =
          approval === 'a'
            ? {
                'choice.one.users': { [userId]: true }
              }
            : {
                'choice.two.users': { [userId]: true }
              }
      }
      const updateData = Object.assign(choiceData, usersData)

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
