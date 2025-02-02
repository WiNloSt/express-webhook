const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()
app.use(compression())
app.use(morgan('combined'))

const wiseWebhookRouter = express.Router()
wiseWebhookRouter.use(bodyParser.text({ type: '*/*' }))
app.use('/wise-webhook', wiseWebhookRouter)
wiseWebhookRouter.post('/', function (req, res) {
  const originalBody = req.body
  try {
    const jsonBody = JSON.parse(originalBody)
    res.send('success')
  } catch (_error) {
    res.status(400).send('Invalid JSON')
  }
})

app.listen(3000)
