const fetchOrdersByTypeId = async (typeId) => {
  try {
    const response = await fetch(`http://esi.evetech.net/latest/markets/10000002/orders/?type_id=${typeId}`, {
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

export default {
  fetchOrdersByTypeId
}
