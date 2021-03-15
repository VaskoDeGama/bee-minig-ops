/**
 * @param {number} price
 * @returns {number} price
 */
const roundPrice = (price) => {
  return Math.trunc((price + Number.EPSILON))
}

/**
 *
 * @param {object} prevRecord
 * @param {number} addedQuantity
 * @returns {object}
 */
const updateItemRecord = (prevRecord, addedQuantity) => {
  const { quantity: prevQuantity, baseInfo, prices, itemType, itemGroup } = prevRecord

  const quantity = prevQuantity + addedQuantity

  console.log(itemType, prices)
  return {
    quantity,
    baseInfo,
    prices,
    itemType,
    itemGroup,
    totalVolume: Math.round(quantity * baseInfo.volume),
    totalPrice: roundPrice(quantity * prices.buy.percentile)
  }
}
/**
 *
 * @param {string} itemType
 * @param {string} itemGroup
 * @param {string|number} quantityValue
 * @param {object} [baseInfo={}]
 * @param {object} [prices={}]
 * @returns {object}
 */
const createItemRecord = (itemType, itemGroup, quantityValue, baseInfo = {}, prices = {}) => {
  const quantity = parseInt(quantityValue)

  return {
    itemType,
    quantity,
    itemGroup,
    baseInfo,
    prices,
    totalVolume: Math.round(quantity * baseInfo.volume),
    totalPrice: roundPrice(quantity * prices.buy.percentile)
  }
}

/**
 *
 * @param {string} rawDate = 2021.03.11 17:26
 * @returns {Date}
 */
const parseDate = (rawDate) => {
  const [dateString] = rawDate.split(' ')
  const [year, month, day] = dateString.split('.')
  const date = new Date(Date.now())

  date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
  date.setHours(0, 0, 0, 0)
  return date
}

export {
  parseDate,
  updateItemRecord,
  createItemRecord,
  roundPrice
}
