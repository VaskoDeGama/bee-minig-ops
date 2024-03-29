<template>
  <b-row class="min-vw-100 mt-3 mb-3 d-flex flex-md-column flex-lg-row  ">
    <b-col md="12" lg="3" class="mb-3 d-flex flex-column justify-content-lg-start justify-content-md-center  align-items-md-stretch">
      <h4 class="ml-3 mr-3">Fleet log parser</h4>
      <ParseForm :parse-log="parseLog"/>
    </b-col>
    <b-col class="d-flex flex-column">
      <FleetTotal :fleet="fleet" :fleet-parsed="fleetParsed"/>
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
import ParseForm from '../parse-form.vue'

import { updateItemRecord, createItemRecord, roundPrice, parseDate, normalizeString } from '../utils.js'
import api from '../../services/api'

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
        'Spodumain',
        'Bitumens',
        'Carnotite',
        'Chromite',
        'Cinnabar',
        'Cobaltite',
        'Coesite',
        'Euxenite',
        'Loparite',
        'Monazite',
        'Otavite',
        'Pollucite',
        'Scheelite',
        'Sperrylite',
        'Sylvite',
        'Titanite',
        'Vanadinite',
        'Xenotime',
        'Ytterbite',
        'Zircon',
        'Ubiquitous Moon Asteroids',
        'Common Moon Ore Processing',
        'Uncommon Moon Ore Processing',
        'Rare Moon Ore Processing',
        'Exceptional Moon Ore Processing'
      ],
      prices: {}
    }
  },
  methods: {
    toast (title, message, variant) {
      this.$bvToast.toast(message, {
        title: title,
        toaster: 'b-toaster-top-right',
        solid: true,
        variant
      })
    },
    /**
     * @param {string[]} items
     * @param {string} market
     * @returns {object}
     */
    async getPricePrasial (items, market) {
      const formattedTypes = items.map(name => {
        return { name }
      })
      const { success, data, message } = await api.fetchPricesFromEvePrasial(formattedTypes, market)

      if (success) {
        const { items } = data
        const prices = {}

        for (const item of items) {
          prices[item.name] = item.prices
          prices[item.name]['typeVolume'] = item.typeVolume
        }

        return prices
      } else {
        console.error(message)
        this.toast('Get price failed!', message, 'danger')
        return {}
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

      for (const { itemType, itemGroup, quantity: addedQuantity, prices } of altItems) {
        if (Reflect.has(mainRecord.items, itemType)) {
          mainRecord.items[itemType] = updateItemRecord(mainRecord.items[itemType], addedQuantity)
        } else {
          mainRecord.items[itemType] = createItemRecord(itemType, itemGroup, addedQuantity, prices)
        }
      }

      altRecord.isMain = false
      mainRecord.totalVolume += altRecord.totalVolume
      mainRecord.totalPrice = roundPrice(mainRecord.totalPrice + altRecord.totalPrice)
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
      if (!log || log.length < 20) {
        this.toast('Invalid source text', 'The text you are trying to parse does not match. Try to copy the text from the log file!', 'warning')
        return
      }

      this.prices = {}
      this.fleet = {}
      this.orcaReward = {}
      this.fleetParsed = false

      const rawRows = log.split('\n')

      rawRows.shift() // remove headers row

      if (rawRows.length) {
        const fleet = { }

        const [rawDate] = rawRows[0].split('\t')

        this.fleetDate = parseDate(rawDate)

        const rows = []
        const itemNames = []

        for (const row of rawRows) {
          const [, character, itemTypeRaw, quantityValue, itemGroupRaw] = row.split('\t')

          if (!character || !itemTypeRaw || !quantityValue || !itemGroupRaw) {
            continue
          }

          const itemType = normalizeString(itemTypeRaw)
          const itemGroup = normalizeString(itemGroupRaw)

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

          const prices = this.prices[itemType]

          if (prices) {
            const record = createItemRecord(itemType, itemGroup, quantityValue, prices)

            characterRecord.items[itemType] = record
            characterRecord.totalPrice += record.totalPrice
            characterRecord.totalVolume += record.totalVolume

            fleet[character] = characterRecord
          }
        }

        this.fleet = fleet
        this.fleetParsed = true
      } else {
        this.toast('Invalid source text', 'The text you are trying to parse does not match. Try to copy the text from the log file!', 'warning')
      }
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
          const { itemType, itemGroup, quantity: quantityValue, prices } = item
          const reward = Math.round(quantityValue * this.orcaRewardPercent)

          const rewardVolume = Math.round(reward * prices.typeVolume)
          const rewardPrice = roundPrice(reward * prices.buy.max)

          if (Reflect.has(this.orcaReward, itemType)) {
            this.orcaReward[itemType] = this.orcaReward[itemType] + reward
          } else {
            this.orcaReward[itemType] = reward
          }

          if (Reflect.has(orcaRecord.items, itemType)) {
            orcaRecord.items[itemType] = updateItemRecord(orcaRecord.items[itemType], reward)
            orcaRecord.totalVolume += rewardVolume
            orcaRecord.totalPrice += rewardPrice
          } else {
            orcaRecord.items[itemType] = createItemRecord(itemType, itemGroup, reward, prices)
            orcaRecord.totalVolume += rewardVolume
            orcaRecord.totalPrice += rewardPrice
          }

          characterRecord.items[itemType] = updateItemRecord(characterRecord.items[itemType], -reward)
          characterRecord.totalVolume += -rewardVolume
          characterRecord.totalPrice += -rewardPrice
        }
      }
    }
  }
}
</script>
