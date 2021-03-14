<template>
  <b-row class="min-vw-100 mt-3 mb-3 d-flex flex-md-column flex-lg-row  ">
    <b-col md="12" lg="3" class="mb-5">
      <ParseForm :parse-log="parseLog"/>
    </b-col>
    <b-col class="d-flex flex-column">

      <FleetTotal/>
      <FleetDetails
          :fleet="fleet"
          :on-delete-hauler="onDeleteHauler"
          :has-orca="hasOrca"
          :on-orca-change="onOrcaChange"
          :on-select-alt="onSelectAlt"/>

    </b-col>

  </b-row>
</template>

<script>

import FleetTotal from './fleet-result.vue'
import FleetDetails from './fleet-details.vue'
import ParseForm from './parse-form.vue'

export default {
  components: {
    FleetDetails,
    FleetTotal,
    ParseForm
  },
  data () {
    return {
      fleet: {
        items: {},
        totalPrice: {},
        totalVolume: {}
      },
      invTypes: [],
      loading: false,
      hasOrca: false,
      itemsFilter: [
        'Plagioclase',
        'Pyroxeres',
        'Scordite',
        'Veldspar',
        'Arkonor',
        'Bistot',
        'Crokite',
        'Dark Ochre',
        'Gneiss',
        'Hedbergite',
        'Hemorphite',
        'Jaspet',
        'Kernite',
        'Omber',
        'Spodumain'],
      baseInfo: {},
      prices: {}
    }
  },

  async beforeMount () {
    await this.getInvTypes()
  },
  methods: {
    /**
     * Fetch baseInfo table
     * @returns {Promise<void>}
     */
    async getInvTypes () {
      const { success, data, message } = await this.$api.sde.fetchInvTypes()

      if (success) {
        this.invTypes = data.reduce((types, value) => {
          types[value.typeName] = value
          return types
        })
      } else {
        // TODO: show message alert
        console.error(message)
      }
    },
    /**
     * Move alt into main character
     * @param {Event} event
     */
    async onSelectAlt (event) {
      event.preventDefault()

      const mainCharacter = event.target.value

      if (!mainCharacter) {
        return
      }

      const altCharacter = event.target.dataset['character']

      const mainRecord = this.fleet[mainCharacter]
      const altRecord = this.fleet[altCharacter]

      const altItems = Object.values(altRecord.items)

      for (const { itemType, itemGroup, quantity: addedQuantity, baseInfo, prices } of altItems) {
        if (Reflect.has(mainRecord.items, itemType)) {
          mainRecord.items[itemType] = this.updateItemRecord(mainRecord.items[itemType], addedQuantity)
        } else {
          mainRecord.items[itemType] = this.createItemRecord(itemType, itemGroup, addedQuantity, false, baseInfo, prices)
        }
      }

      altRecord.isMain = false
      mainRecord.totalVolume += altRecord.totalVolume
      mainRecord.totalPrice += altRecord.totalPrice
      mainRecord.alts.push(altCharacter)
      mainRecord.hasAlts = true
    },
    /**
     * Ser isOrca
     * @param {string} character
     */
    onOrcaChange (character) {
      this.hasOrca = !this.hasOrca
      this.fleet[character].isOrca = !this.fleet[character].isOrca
    },
    /**
     * Delete hauler from flot isOrca
     * @param {string} character
     */
    onDeleteHauler (character) {
      this.$delete(this.fleet, character)
    },
    /**
     * Parse fleet log to object
     * @param {string} log
     */
    async parseLog (log) {
      this.prices = {}
      this.fleet = {}
      this.baseInfo = {}

      const rows = log.split('\n')

      rows.shift() // remove headers row
      rows.pop() // remove empty row

      const fleet = {}

      for (const row of rows) {
        const [, character, itemTypeRaw, quantityValue, itemGroupRaw] = row.split('\t')

        if (!character || !itemTypeRaw || !quantityValue || !itemGroupRaw) {
          continue
        }

        const itemType = itemTypeRaw.match(/"(\w.*)"/) ? itemTypeRaw.match(/"(\w.*)"/)[1] : itemTypeRaw
        const itemGroup = itemGroupRaw.match(/"(\w.*)"/) ? itemGroupRaw.match(/"(\w.*)"/)[1] : itemGroupRaw

        if (character && this.itemsFilter.includes(itemGroup)) {
          const characterRecord = Reflect.has(fleet, character)
            ? fleet[character]
            : { items: {}, isOrca: false, name: character, alts: [], isMain: true, hasAlts: false, totalVolume: 0, totalPrice: 0 }

          const record = await this.createItemRecord(itemType, itemGroup, quantityValue)

          characterRecord.items[itemType] = record
          characterRecord.totalPrice += record.totalPrice
          characterRecord.totalVolume += record.totalVolume

          fleet[character] = characterRecord
        }
      }

      this.fleet = fleet
      console.log(fleet)
    },
    /**
     * @param {number} price
     * @returns {number} price
     */
    roundPrice (price) {
      return Math.round((price + Number.EPSILON) * 100) / 100
    },
    /**
     * @param {object[]} orders
     * @returns {number}
     */
    getAvgPrice (orders) {
      const avgPrice = orders.reduce((sum, { price }) => sum + price, 0) / orders.length

      return this.roundPrice(avgPrice)
    },
    /**
     * Get item base info from sde
     * @param {string} itemType
     * @returns {null | object}
     */
    async getBaseInfo (itemType) {
      if (this.invTypes.hasOwnProperty(itemType)) {
        return this.invTypes[itemType]
      }
    },
    /**
     * Fetch orders, filtered by jita, and get:
     * - avg sel buy price (by last 3 orders)
     * - fast sel buy price (by last 1 order)
     * @param {number} typeId
     * @returns {object}
     */
    async getPrice (typeId) {
      try {
        if (this.prices.hasOwnProperty(typeId)) {
          return this.prices[typeId]
        } else {
          const structure = 60003760
          const { success, data, message } = await this.$api.esi.fetchOrdersByTypeId(typeId)

          if (!success) {
            // TODO: send alert with message
            console.error(message)
            return {
              fastBuyPrice: 0,
              fastSelPrice: 0
            }
          } else {
            const sell = []
            const buy = []

            for (const order of data) {
              if (order.location_id === structure) {
                if (order.is_buy_order) {
                  buy.push(order)
                } else {
                  sell.push(order)
                }
              }
            }

            const maxBuyOrders = buy.sort((a, b) => b.price - a.price)
            const minSellOrders = sell.sort((a, b) => a.price - b.price)

            const fastBuyPrice = this.getAvgPrice(maxBuyOrders.slice(0, 1))
            const fastSelPrice = this.getAvgPrice(minSellOrders.slice(0, 1))

            const prices = {
              fastBuyPrice,
              fastSelPrice
            }

            this.prices[typeId] = prices

            return prices
          }
        }
      } catch (e) {
        console.error('getPrice failed', e)
      }
    },
    /**
     *
     * @param {object} prevRecord
     * @param {string} addedQuantity
     * @returns {object}
     */
    updateItemRecord (prevRecord, addedQuantity) {
      const { quantity: prevQuantity, baseInfo, prices, itemType, itemGroup } = prevRecord

      const quantity = prevQuantity + addedQuantity

      return {
        quantity,
        baseInfo,
        prices,
        itemType,
        itemGroup,
        totalVolume: Math.round(quantity * baseInfo.volume),
        totalPrice: this.roundPrice(quantity * prices.fastSelPrice)
      }
    },
    /**
     *
     * @param {string} itemType
     * @param {string} itemGroup
     * @param {string} quantityValue
     * @param {boolean} [withFetch=true]
     * @param {object} [altBaseInfo={}]
     * @param {object} [altPrices={}]
     * @returns {Promise<object>}
     */
    async createItemRecord (itemType, itemGroup, quantityValue, withFetch = true, altBaseInfo = {}, altPrices = {}) {
      const baseInfo = withFetch ? await this.getBaseInfo(itemType) : altBaseInfo
      const prices = withFetch ? await this.getPrice(baseInfo.typeID) : altPrices

      const quantity = parseInt(quantityValue)

      return {
        itemType,
        quantity,
        itemGroup,
        baseInfo,
        prices,
        totalVolume: Math.round(quantity * baseInfo.volume),
        totalPrice: this.roundPrice(quantity * prices.fastBuyPrice)
      }
    }
  }
}
</script>
