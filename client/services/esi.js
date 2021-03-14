const fetchOrdersByTypeId = async (typeId) => {
  try {
    const response = await fetch(`https://esi.evetech.net/latest/markets/10000002/orders/?type_id=${typeId}`, {
      method: 'GET'
    })

    if (response.ok) {
      const data = await response.json()

      return { success: true, data }
    } else {
      const data = await response.json()

      return { success: false, message: data.error }
    }
  } catch (e) {
    return { success: false, message: e.message }
  }
}

const fetchPricesFromEvePrasial = async (types, market) => {
  try {
    const response = await fetch(`https://bee-mining-ops.herokuapp.com//api/getPrices`, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ market_name: market, items: types })
    })

    if (response.ok) {
      return await response.json()
    } else {
      const data = await response.json()

      return { success: false, message: data.error }
    }
  } catch (e) {
    return { success: false, message: e.message }
  }
}

export default {
  fetchOrdersByTypeId,
  fetchPricesFromEvePrasial
}
