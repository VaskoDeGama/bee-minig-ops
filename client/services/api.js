'use strict'

/**
 *
 * @param {object[]} items
 * @param {string} market
 * @returns {Promise<{success: boolean, message: string }>}
 */
const fetchPricesFromEvePrasial = async (items, market) => {
  try {
    const response = await fetch(process.env.ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ market_name: market, items })
    })

    if (response.ok) {
      return await response.json()
    } else {
      const text = await response.text()

      try {
        const data = JSON.parse(text)

        return { success: false, message: data.error }
      } catch (e) {
        return { success: false, message: text }
      }
    }
  } catch (e) {
    return { success: false, message: e.message }
  }
}

export default {
  fetchPricesFromEvePrasial
}
