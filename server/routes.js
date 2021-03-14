const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

// eve eveprasial
// define the home page route
router.post('/getPrices', async (req, res) => {
  try {
    const response = await fetch('https://evepraisal.com/appraisal/structured.json', {
      method: 'post',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json', 'user-agent': req.header['user-agent'] }
    })

    const data = await response.json()

    if (data.hasOwnProperty('appraisal')) {
      res.status(200).json({ 'success': true, data: data.appraisal })
    } else {
      const error = data.error_message

      res.status(400).json({ 'success': false, error })
    }
  } catch (e) {
    console.error(e)
  }
})

module.exports = router
