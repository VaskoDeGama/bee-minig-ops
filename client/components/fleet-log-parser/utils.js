/**
 * @param {number} price
 * @returns {number} price
 */
const roundPrice = (price) => {
  return Math.trunc((price + Number.EPSILON))
}

/**
 *
 * @param {number} value
 * @param {string} [unitText='']
 * @returns {string}
 */
const numberToEveFormat = (value = 0, unitText = '') => {
  const str = value.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ',')

  return `${str} ${unitText}`
}

/**
 *
 * @param {object} prevRecord
 * @param {number} addedQuantity
 * @returns {object}
 */
const updateItemRecord = (prevRecord, addedQuantity) => {
  const { quantity: prevQuantity, prices, itemType, itemGroup } = prevRecord

  const quantity = prevQuantity + addedQuantity

  return {
    quantity,
    prices,
    itemType,
    itemGroup,
    totalVolume: Math.round(quantity * prices.typeVolume),
    totalPrice: roundPrice(quantity * prices.buy.percentile)
  }
}
/**
 *
 * @param {string} itemType
 * @param {string} itemGroup
 * @param {string|number} quantityValue
 * @param {object} [prices={}]
 * @returns {object}
 */
const createItemRecord = (itemType, itemGroup, quantityValue, prices = {}) => {
  const quantity = parseInt(quantityValue)

  return {
    itemType,
    quantity,
    itemGroup,
    prices,
    totalVolume: Math.round(quantity * prices.typeVolume),
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

/**
 * @param {Date} date
 * @returns {string}
 */
const dateToLongString = (date) => {
  return new Intl.DateTimeFormat('en-EU', {
    dateStyle: 'long'
  }).format(date)
}

export {
  parseDate,
  updateItemRecord,
  createItemRecord,
  roundPrice,
  numberToEveFormat,
  dateToLongString
}
