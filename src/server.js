import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { isVerified } from './verify.mjs'
import Api from './api.mjs'

const isDev = process.env.NODE_ENV === 'development'
if (isDev) {
  import('./setupDevEnv.mjs')
}

const app = express()
app.use(compression())
app.use(morgan('combined'))

const wiseWebhookRouter = express.Router()
wiseWebhookRouter.use(bodyParser.text({ type: '*/*' }))
app.use('/wise-webhook', wiseWebhookRouter)
// @ts-ignore
wiseWebhookRouter.post('/', function (req, res) {
  const originalBody = req.body
  const signatureHeader = /** @type {string}*/ (req.headers['x-signature-sha256'])
  try {
    const jsonBody = JSON.parse(originalBody)
    if (isVerified(originalBody, signatureHeader) || isDev) {
      console.log('body', JSON.stringify(jsonBody, null, 2))
      // Testing: every jar is deposited for only $1
      // Api.automateBudgets()
      //   .then((responses) => {
      //     console.log('automate budgets', responses)
      //   })
      //   .catch((error) => console.error(error))
    } else {
      console.error('Invalid signature')
      return res.status(400).send('Invalid signature')
    }
    res.send('success')
  } catch (error) {
    // @ts-ignore
    res.status(400).send(error.message)
  }
})

console.log('Server started at http://localhost:3001')
app.listen(3001)
