import firebase from '~/plugins/firebase'

const storageRef = firebase.storage().ref()

export default {
  fetchStorageUrl(url) {
    const decodeUrl = decodeURI(url)
    return new Promise((resolve, reject) => {
      storageRef
        .child(decodeUrl)
        .getDownloadURL()
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  uploadImage(image, imageName) {
    /* imageData
    {
     name: '',
     url: '',
     file: ''
    }
    imageNameはquestionId_0 or questionId_1
     */
    const ref = storageRef.child('images/' + imageName)
    return new Promise((resolve, reject) => {
      ref
        .put(image.file)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
