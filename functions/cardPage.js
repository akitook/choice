const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

const CONFIG = functions.config()
const app_domain = CONFIG.app.domain
const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630

const func = functions.https.onRequest((req, res) => {
  const [, , cardId] = req.path.split('/')
  return db
    .collection('questions')
    .doc(cardId)
    .get()
    .then(snap => {
      if (!snap) {
        res.status(404).end('404 Not Found')
        return
      }
      const cardData = snap ? snap.data() : {}
      const html = createHtml(cardData)
      res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
      res.status(200).end(html)
      return
    })
    .catch(err => {
      console.warn(err)
      // 略 : エラー時はデフォルトのhtml（固定のOGP）を返す
    })
})

const createHtml = cardData => {
  const SITEURL = `https://${app_domain}`
  const PAGEURL = `${SITEURL}/card/${cardData.id}`
  const TITLE = `${author.displayName}さんの迷い| WAVERRR`
  const DESCRIPTION =
    'WAVERRRは２択の画像で質問を投げかけることができるサービスです。'
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>WAVERRR</title>
    <meta property="og:title" content="${TITLE}">
    <meta property="og:image" content="${SITEURL}/ogp/card/${cardData.id}">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="WAVERRR">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="${SITEURL}/ogp/card/${cardData.id}">
    <meta name="twitter:description" content="${DESCRIPTION}">
  </head>
  <body>
    <script type="text/javascript">window.location="/?id=${
      cardData.id
    }";</script>
  </body>
</html>
`
}

module.exports = func
