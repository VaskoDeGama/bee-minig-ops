const fetch = require('node-fetch')
const { parse } = require('querystring')

/**
 * @param {Date} date
 * @returns {string}
 */
const dateToLongString = (date) => {
  return new Intl.DateTimeFormat('en-EU', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(date)
}

const router = async (req, res) => {
  console.log(`[${dateToLongString(new Date(Date.now()))}] ${req.method} ${req.url}`)

  if (req.url.endsWith('/getPrices') && req.method === 'POST') {
    let rawBody = ''
    let body = null

    req.on('data', (chunk) => {
      rawBody += chunk.toString()
    })
    req.on('end', async () => {
      body = JSON.parse(rawBody)

      try {
        const response = await fetch('https://evepraisal.com/appraisal/structured.json', {
          method: 'post',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json', 'user-agent': req.headers['user-agent'] }
        })

        const data = await response.json()

        if (data.hasOwnProperty('appraisal')) {
          res.setHeader('Content-Type', 'application/json')
          res.writeHead(200)
          res.end(JSON.stringify({ 'success': true, data: data.appraisal }))
        } else {
          const error = data.error_message

          res.setHeader('Content-Type', 'application/json')
          res.writeHead(400)
          res.end(JSON.stringify({ 'success': false, error }))
        }
      } catch (e) {
        console.error(e)
      }
    })
  } else {
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(404)
    res.end(JSON.stringify({ 'success': false, error: 'not found' }))
  }
}

module.exports = router
