const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()
const storage = admin.storage()
const Canvas = require('canvas-prebuilt')
const Image = Canvas.Image

// OGP関連の定数
const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630
const OGP_IMG_ARTWORK_WIDTH = OGP_IMG_WIDTH * 0.5

const func = functions.https.onRequest((req, res) => {
  const [, , , cardId] = req.path.split('/')
  const canvas = new Canvas(OGP_IMG_WIDTH, OGP_IMG_HEIGHT)
  res.set('Cache-Control', 'public, max-age=600, s-maxage=600')

  return db
    .collection('questions')
    .doc(cardId)
    .get()
    .then(snap => {
      if (!snap) {
        res.status(404).end('404 Not Found')
        return null
      }
      return snap.data()
    })
    .then(cardData => {
      if (!cardData) {
        return null
      }
      return drawImg(canvas, cardData)
    })
    .then(isSuccess => {
      // エラーなく完了したらCanvasの内容をpngで出力
      if (isSuccess) {
        res.writeHead(200, { 'Content-Type': 'image/png' })
        canvas.pngStream().pipe(res)
      } else {
        res.status(500).end('500 Server Internal Error')
      }
      return isSuccess
    })
    .catch(_ => {
      res.status(500).end('500 Server Internal Error')
    })
})

const drawImg = (canvas, cardData) => {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d')
    const oneImg = new Image()
    const twoImg = new Image()
    const oneColor = '#FF008C'
    const twoColor = '#3377F6'
    fetchStorageUrl(cardData.choice.one.url).then(oneUrl => {
      oneImg.src = oneUrl
      oneImg.onload = function() {
        //要修正
        let oneImgPos = 0
        const oneImgRatio = oneImg.width / oneImg.height
        if (oneImgRatio >= 1) {
          oneImgPos = (600 - 600 * oneImgRatio) / 2
          ctx.drawImage(oneImg, oneImgPos, 0, 600, 630)
        } else {
          oneImgPos = (600 - 600 / oneImgRatio) / 2
          ctx.drawImage(oneImg, 0, oneImgPos, 600, 630 / oneImgRatio)
        }
        ctx.save()
      }
    })
  })
}

fetchStorageUrl(cardData.choice.two.url).then(twoUrl => {
  twoImg.src = twoUrl
  twoImg.onload = function() {
    let twoImgPos = 0
    const twoImgRatio = twoImg.width / twoImg.height
    if (twoImgRatio >= 1) {
      twoImgPos = (600 - 600 * twoImgRatio) / 2
      ctx.drawImage(twoImg, twoImgPos, 600, 600, 630)
    } else {
      twoImgPos = (600 - 600 / twoImgRatio) / 2
      ctx.drawImage(twoImg, 0, twoImgPos, 600, 630 / twoImgRatio)
    }
    ctx.restore()
    ctx.save()
  }

  ctx.fillStyle = oneColor
  ctx.fillRect = (0, 615, 600, 15)
  ctx.restore()
  ctx.save()
  ctx.fillStyle = twoColor
  ctx.fillRect = (600, 615, 600, 15)
  ctx.restore()
  ctx.save()
  resolve(canvas)
})

const fetchStorageUrl = url => {
  const storageRef = storage.ref()
  const decodeUrl = decodeURI(url)
  return new Promise((resolve, reject) => {
    storageRef
      .child(decodeUrl)
      .getDownloadURL()
      .then(res => {
        resolve(res)
        return
      })
      .catch(err => {
        reject(err)
        return
      })
  })
}

module.exports = func
