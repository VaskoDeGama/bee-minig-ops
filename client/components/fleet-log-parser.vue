<template>
  <b-row class="min-vw-100 mt-3 mb-3 d-flex flex-md-column flex-lg-row  ">
    <b-col md="12" lg="3" class="mb-5">
      <ParseForm :parse-log="parseLog"/>
    </b-col>
    <b-col class="d-flex flex-column">
      <FleetTotal :fleet-total="fleetTotal" :fleet-parsed="fleetParsed"/>
      <FleetDetails
          :fleet="fleet"
          :fleet-parsed="fleetParsed"
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
      orcaRewardPercent: 0.1,
      orcaReward: {},
      fleetParsed: false,
      fleet: {},
      fleetDate: Date.now(),
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
  computed: {
    fleetTotal: function () {
      if (this.fleetParsed) {
        const fleet = Object.values(this.fleet)

        const totalItems = fleet.reduce((items, character) => {
          const altItems = Object.values(character.items)

          for (const { itemType, itemGroup, quantity: addedQuantity, baseInfo, prices } of altItems) {
            if (Reflect.has(items, itemType)) {
              items[itemType] = this.updateItemRecord(items[itemType], addedQuantity)
            } else {
              items[itemType] = this.createItemRecord(itemType, itemGroup, addedQuantity, baseInfo, prices)
            }
          }

          return items
        }, {})

        const totalPrice = this.roundPrice(fleet.reduce((sum, { totalPrice, isMain }) => isMain ? sum + totalPrice : sum, 0))
        const totalVolume = fleet.reduce((sum, { totalVolume, isMain }) => isMain ? sum + totalVolume : sum, 0)

        const allPilots = fleet.map(({ name }) => name)
        const mainPilots = fleet.filter(({ isMain }) => isMain).map(({ name, alts, totalPrice, totalVolume }) => {
          return {
            name,
            alts: alts.map(({ name }) => name),
            totalPrice,
            totalVolume
          }
        })
        const [orca] = fleet.filter(({ isOrca }) => isOrca)

        return {
          fleetDate: this.fleetDate,
          totalPrice,
          totalVolume,
          allPilots,
          mainPilots,
          orca: orca ? orca.name : '',
          totalItems
        }
      } else {
        return {}
      }
    }
  },
  async beforeMount () {
    await this.getInvTypes()
  },
  methods: {
    /**
     * @param {string[]} types
     * @param {string} market
     * @returns {object}
     */
    async getPricePrasial (types, market) {
      const formattedTypes = types.map(name => {
        return { name }
      })
      const { success, data, message } = await this.$api.esi.fetchPricesFromEvePrasial(formattedTypes, market)

      if (success) {
        const { items } = data
        const prices = {}

        for (const item of items) {
          prices[item.name] = item.prices
        }

        return prices
      } else {
        console.error(message)
        return {}
      }
    },
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
          mainRecord.items[itemType] = await this.createItemRecord(itemType, itemGroup, addedQuantity, baseInfo, prices)
        }
      }

      altRecord.isMain = false
      mainRecord.totalVolume += altRecord.totalVolume
      mainRecord.totalPrice = this.roundPrice(mainRecord.totalPrice + altRecord.totalPrice)
      mainRecord.alts.push(altRecord)
      mainRecord.hasAlts = true
    },
    /**
     * Ser isOrca
     * @param {string} character
     */
    onOrcaChange (character) {
      if (!this.hasOrca) {
        this.hasOrca = !this.hasOrca
        this.fleet[character].isOrca = !this.fleet[character].isOrca
        this.getOrcaReward(this.fleet, character)
      }
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
     * @param {string} market
     */
    async parseLog (log, market) {
      this.prices = {}
      this.fleet = {}
      this.baseInfo = {}
      this.orcaReward = {}
      this.fleetParsed = false

      const rawRows = log.split('\n')

      rawRows.shift() // remove headers row

      const fleet = { }

      const [rawDate] = rawRows[0].split('\t')

      this.fleetDate = this.parseDate(rawDate)

      const rows = []
      const itemNames = []

      for (const row of rawRows) {
        const [, character, itemTypeRaw, quantityValue, itemGroupRaw] = row.split('\t')

        if (!character || !itemTypeRaw || !quantityValue || !itemGroupRaw) {
          continue
        }

        const itemType = itemTypeRaw.match(/"(\w.*)"/) ? itemTypeRaw.match(/"(\w.*)"/)[1] : itemTypeRaw
        const itemGroup = itemGroupRaw.match(/"(\w.*)"/) ? itemGroupRaw.match(/"(\w.*)"/)[1] : itemGroupRaw

        if (this.itemsFilter.includes(itemGroup)) {
          if (!itemNames.includes(itemType)) {
            itemNames.push(itemType)
          }

          rows.push([character, itemType, quantityValue, itemGroup])
        }
      }

      this.prices = await this.getPricePrasial(itemNames, market)

      for (const row of rows) {
        const [character, itemType, quantityValue, itemGroup] = row

        const characterRecord = Reflect.has(fleet, character)
          ? fleet[character]
          : { items: {}, isOrca: false, name: character, alts: [], isMain: true, hasAlts: false, totalVolume: 0, totalPrice: 0 }

        const baseInfo = await this.getBaseInfo(itemType)

        const prices = this.prices[itemType]

        const record = await this.createItemRecord(itemType, itemGroup, quantityValue, baseInfo, prices)

        characterRecord.items[itemType] = record
        characterRecord.totalPrice += record.totalPrice
        characterRecord.totalVolume += record.totalVolume

        fleet[character] = characterRecord
      }

      this.fleet = fleet
      this.fleetParsed = true
    },
    /**
     * @param {number} price
     * @returns {number} price
     */
    roundPrice (price) {
      return Math.trunc((price + Number.EPSILON))
    },
    /**
     * Get item base info from sde
     * @param {string} itemType
     * @returns {null | object}
     */
    async getBaseInfo (itemType) {
      if (this.invTypes.hasOwnProperty(itemType)) {
        const baseInfo = this.invTypes[itemType]

        delete baseInfo.description
        return baseInfo
      }
    },
    /**
     *
     * @param {object} prevRecord
     * @param {number} addedQuantity
     * @returns {object}
     */
    updateItemRecord (prevRecord, addedQuantity) {
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
        totalPrice: this.roundPrice(quantity * prices.buy.percentile)
      }
    },
    /**
     *
     * @param {string} itemType
     * @param {string} itemGroup
     * @param {string|number} quantityValue
     * @param {object} [baseInfo={}]
     * @param {object} [prices={}]
     * @returns {object}
     */
    createItemRecord (itemType, itemGroup, quantityValue, baseInfo = {}, prices = {}) {
      const quantity = parseInt(quantityValue)

      return {
        itemType,
        quantity,
        itemGroup,
        baseInfo,
        prices,
        totalVolume: Math.round(quantity * baseInfo.volume),
        totalPrice: this.roundPrice(quantity * prices.buy.percentile)
      }
    },
    /**
     *
     * @param {string} rawDate = 2021.03.11 17:26
     * @returns {Date}
     */
    parseDate (rawDate) {
      const [dateString] = rawDate.split(' ')
      const [year, month, day] = dateString.split('.')
      const date = new Date(Date.now())

      date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
      date.setHours(0, 0, 0, 0)
      return date
    },
    /**
     * Толко в одну сторону
     * @param {object} fleet
     * @param {string} orcaName
     */
    getOrcaReward (fleet, orcaName) {
      const orcaRecord = fleet[orcaName]
      const characters = Object.values(fleet).filter(({ name }) => name !== orcaName)

      for (const characterRecord of characters) {
        const items = Object.values(characterRecord.items)

        for (const item of items) {
          const { itemType, itemGroup, quantity: quantityValue, baseInfo, prices } = item
          const reward = Math.round(quantityValue * this.orcaRewardPercent)

          const rewardVolume = Math.round(reward * baseInfo.volume)
          const rewardPrice = this.roundPrice(reward * prices.buy.percentile)

          if (Reflect.has(this.orcaReward, itemType)) {
            this.orcaReward[itemType] = this.orcaReward[itemType] + reward
          } else {
            this.orcaReward[itemType] = reward
          }

          if (Reflect.has(orcaRecord.items, itemType)) {
            orcaRecord.items[itemType] = this.updateItemRecord(orcaRecord.items[itemType], reward)
            orcaRecord.totalVolume += rewardVolume
            orcaRecord.totalPrice += rewardPrice
          } else {
            orcaRecord.items[itemType] = this.createItemRecord(itemType, itemGroup, reward, baseInfo, prices)
            orcaRecord.totalVolume += rewardVolume
            orcaRecord.totalPrice += rewardPrice
          }

          characterRecord.items[itemType] = this.updateItemRecord(characterRecord.items[itemType], -reward)
          characterRecord.totalVolume += -rewardVolume
          characterRecord.totalPrice += -rewardPrice
        }
      }

      console.log(this.orcaReward)
    }
  }
}
</script>
