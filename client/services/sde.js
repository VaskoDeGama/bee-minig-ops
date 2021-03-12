const fetchInvTypes = async () => {
  try {
    const response = await fetch(`https://sde.zzeve.com/invTypes.json`, {
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
  fetchInvTypes
}
