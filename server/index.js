const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()

app.set('port', 3000)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use('/', express.static(path.join(__dirname, '../dist')))

app.listen(app.get('port'), async () => {
  console.log(`[OK] Server is running on localhost:${app.get('port')}`)
})

// http://sde.zzeve.com/ sde json
