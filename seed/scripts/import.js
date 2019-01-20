const admin = require('../../node_modules/firebase-admin')
const serviceAccount = require('../../config/firebaseAdmin-key.json')
const { databaseURL } = require('../../config/firebase-init')
const type = process.argv[2]
const lang = process.argv[3]

const langs = [
  'ja',
  'en',
  'hans', //簡体字 ※soundはzh
  'hant', //繁体字 ※soundはzh
  'ko', //韓国語
  'es', //スペイン語
  'fr'
]

if (!type) {
  console.log('input type name. question or ...')
  return process.exit()
}

const data = type === 'questions' ? require('../questions.json') : null

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

const settings = { /* your settings... */ timestampsInSnapshots: true }

admin.firestore().settings(settings)

data &&
  Object.keys(data).forEach(key => {
    const db = admin.firestore()
    const newDocRef = db.collection(type).doc()
    const nestedContent = {
      ...data[key],
      id: newDocRef.id,
      created: new Date()
    }
    newDocRef
      .set(nestedContent)
      .then(res => {
        console.log('Document successfully written!')
      })
      .catch(error => {
        console.error('Error writing document: ', error)
      })
  })
