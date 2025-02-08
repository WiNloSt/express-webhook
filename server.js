const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { isVerified } = require('./verify')

const app = express()
app.use(compression())
app.use(morgan('combined'))

const wiseWebhookRouter = express.Router()
wiseWebhookRouter.use(bodyParser.text({ type: '*/*' }))
app.use('/wise-webhook', wiseWebhookRouter)
wiseWebhookRouter.post('/', function (req, res) {
  const originalBody = req.body
  const signatureHeader = req.headers['x-signature-sha256']
  try {
    const jsonBody = JSON.parse(originalBody)
    if (isVerified(originalBody, signatureHeader)) {
      console.log('body', JSON.stringify(jsonBody, null, 2))
    } else {
      console.error('Invalid signature')
      return res.status(400).send('Invalid signature')
    }
    res.send('success')
  } catch (_error) {
    res.status(400).send('Invalid JSON')
  }
})

console.log('Server started at http://localhost:3000')
app.listen(3000)
