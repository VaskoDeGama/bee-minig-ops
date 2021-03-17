const express = require('express')
const morgan = require('morgan')
const history = require('connect-history-api-fallback')
const app = express()
const router = require('./routes')

app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(history({
  verbose: true
}))
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

app.use('/api', router)

app.listen(app.get('port'), async () => {
  console.log(`[OK] Server is running on localhost:${app.get('port')}`)
})
