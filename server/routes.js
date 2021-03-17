const fetch = require('node-fetch')

const router = async (req, res) => {
  if (req.url.endsWith('/getPrices') && req.method === 'POST') {
    try {
      const response = await fetch('https://evepraisal.com/appraisal/structured.json', {
        method: 'post',
        body: JSON.stringify(req.body),
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
  } else {
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(404)
    res.end(JSON.stringify({ 'success': false, error: 'not found' }))
  }
}

module.exports = router
