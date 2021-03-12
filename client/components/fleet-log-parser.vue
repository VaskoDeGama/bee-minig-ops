<template>
  <b-row class="m-5" >
    <b-col md="4">
      <b-form @submit="parseLog">
        <b-form-group>
          <b-form-textarea
              id="textarea"
              v-model="logText"
              placeholder="Enter fleet log"
              rows="20"
              max-rows="30"/>
        </b-form-group>

        <b-button type="submit" variant="primary">Parse</b-button>
        <b-button type="reset" variant="danger">Clear</b-button>
      </b-form>

    </b-col>
    <b-col>
      <b-card header="Parsed log">
        <div v-for="(character, characterName) in fleet" :key="characterName">
          <CharacterTable :character="character" :on-select-alt="onSelectAlt" :options="options" />
        </div>
      </b-card>
    </b-col>

  </b-row>
</template>

<script>
import services from './../services'
import CharacterTable from './character-table.vue'

const { esi, sde } = services

export default {
  components: {
    CharacterTable
  },
  data () {
    return {
      logText: 'Time\tCharacter\tItem Type\tQuantity\tItem Group\n' +
          '2021.03.08 13:47\tVITO PR\tPyroxeres\t963\tPyroxeres\n' +
          '2021.03.08 13:45\tVDG Mabuta\tAzure Plagioclase\t6098\tPlagioclase\n' +
          '2021.03.08 13:31\tDiana Udan\tPlagioclase\t248\tPlagioclase\n' +
          '2021.03.08 13:30\tVITO PR\tMetal Scraps\t1\tCommodities\n' +
          '2021.03.08 13:30\tVITO PR\tAntimatter Charge S\t100\tHybrid Charge\n' +
          '2021.03.08 13:29\tVDG Mabuta\tPlagioclase\t328\tPlagioclase\n' +
          '2021.03.08 13:29\tVITO PR\tCharred Micro Circuit\t4\tSalvaged Materials\n' +
          '2021.03.08 13:29\tVITO PR\tMalfunctioning Shield Emitter\t1\tSalvaged Materials\n' +
          '2021.03.08 13:29\tVITO PR\tConductive Polymer\t1\tSalvaged Materials\n' +
          '2021.03.08 13:23\tVITO PR\tDamaged Artificial Neural Network\t1\tSalvaged Materials\n' +
          '2021.03.08 13:24\tVDG Mabuta\tPyroxeres\t6963\tPyroxeres\n' +
          '2021.03.08 13:22\tDiana Udan\tPyroxeres\t2315\tPyroxeres\n' +
          '2021.03.08 13:32\tNIKOJIA SPIRTOVKIN\tCondensed Scordite\t53119\tScordite\n' +
          '2021.03.08 13:48\tNIKOJIA SPIRTOVKIN\tViscous Pyroxeres\t15422\tPyroxeres\n' +
          '2021.03.08 13:15\tDiana Udan\tMetal Scraps\t1\tCommodities\n' +
          '2021.03.08 13:18\tVDG Infinity\tAzure Plagioclase\t25875\tPlagioclase\n' +
          '2021.03.08 13:30\tVDG Infinity\tMassive Scordite\t32580\tScordite\n' +
          '2021.03.08 13:22\tVITO PR\tRich Plagioclase\t11279\tPlagioclase\n' +
          '2021.03.08 13:44\tVITO PR\tAzure Plagioclase\t17291\tPlagioclase\n' +
          '2021.03.08 13:08\tVITO PR\tPlagioclase\t6533\tPlagioclase\n' +
          '2021.03.08 13:40\tNIKOJIA SPIRTOVKIN\tScordite\t31977\tScordite\n' +
          '2021.03.08 13:31\tNIKOJIA SPIRTOVKIN\tMassive Scordite\t20710\tScordite\n' +
          '2021.03.08 13:47\tDiana Udan\tVeldspar\t121667\tVeldspar\n' +
          '2021.03.08 13:49\tVDG Mabuta\tSolid Pyroxeres\t15453\tPyroxeres\n' +
          '2021.03.08 13:48\tVDG Mabuta\tViscous Pyroxeres\t65858\tPyroxeres\n' +
          '2021.03.08 13:48\tNIKOJIA SPIRTOVKIN\tSolid Pyroxeres\t18971\tPyroxeres\n' +
          '2021.03.08 13:38\tNIKOJIA SPIRTOVKIN\tConcentrated Veldspar\t71417\tVeldspar\n' +
          '2021.03.08 13:48\tNIKOJIA SPIRTOVKIN\tPyroxeres\t8693\tPyroxeres\n' +
          '2021.03.08 13:21\tDiana Udan\tViscous Pyroxeres\t28788\tPyroxeres\n' +
          '2021.03.08 13:49\tVITO PR\tViscous Pyroxeres\t15791\tPyroxeres\n' +
          '2021.03.08 13:42\tVDG Mabuta\tScordite\t27489\tScordite\n' +
          '2021.03.08 13:45\tDiana Udan\tDense Veldspar\t268930\tVeldspar\n' +
          '2021.03.08 13:41\tVDG Mabuta\tMassive Scordite\t85406\tScordite\n' +
          '2021.03.08 12:38\tVDG Infinity\tSolid Pyroxeres\t4585\tPyroxeres\n' +
          '2021.03.08 13:48\tDiana Udan\tConcentrated Veldspar\t116727\tVeldspar\n' +
          '2021.03.08 12:49\tVITO PR\tSolid Pyroxeres\t3648\tPyroxeres\n' +
          '2021.03.08 13:25\tDiana Udan\tCondensed Scordite\t30204\tScordite\n' +
          '2021.03.08 13:41\tVDG Mabuta\tCondensed Scordite\t32101\tScordite\n' +
          '2021.03.08 13:46\tNIKOJIA SPIRTOVKIN\tPlagioclase\t31628\tPlagioclase\n' +
          '2021.03.08 12:47\tDiana Udan\tScordite\t53276\tScordite\n' +
          '2021.03.08 12:32\tVDG Mabuta\tConcentrated Veldspar\t79834\tVeldspar\n' +
          '2021.03.08 13:46\tNIKOJIA SPIRTOVKIN\tDense Veldspar\t305045\tVeldspar\n' +
          '2021.03.08 12:26\tVDG Infinity\tPyroxeres\t3970\tPyroxeres\n' +
          '2021.03.08 13:48\tVDG Mabuta\tVeldspar\t50724\tVeldspar\n' +
          '2021.03.08 13:38\tDiana Udan\tMassive Scordite\t110421\tScordite\n' +
          '2021.03.08 13:32\tVDG Infinity\tCondensed Scordite\t20460\tScordite\n' +
          '2021.03.08 13:23\tVDG Infinity\tViscous Pyroxeres\t29236\tPyroxeres\n' +
          '2021.03.08 13:15\tVDG Infinity\tPlagioclase\t23383\tPlagioclase\n' +
          '2021.03.08 13:20\tVDG Infinity\tConcentrated Veldspar\t63876\tVeldspar\n' +
          '2021.03.08 12:20\tDiana Udan\tRich Plagioclase\t49804\tPlagioclase\n' +
          '2021.03.08 13:31\tVDG Infinity\tDense Veldspar\t217345\tVeldspar\n' +
          '2021.03.08 13:48\tVDG Mabuta\tDense Veldspar\t300472\tVeldspar\n' +
          '2021.03.08 13:13\tNIKOJIA SPIRTOVKIN\tAzure Plagioclase\t47712\tPlagioclase\n' +
          '2021.03.08 12:20\tNIKOJIA SPIRTOVKIN\tRich Plagioclase\t86101\tPlagioclase\n',
      fleet: {},
      baseInfo: {},
      prices: {},
      invTypes: [],
      loading: false,

      itemsFilter: ['Plagioclase', 'Pyroxeres', 'Scordite', 'Veldspar', 'Arkonor', 'Bistot', 'Crokite', 'Dark Ochre', 'Gneiss', 'Hedbergite', 'Hemorphite', 'Jaspet', 'Kernite', 'Omber', 'Spodumain']
    }
  },
  computed: {
    options: function () {
      return [
        ...Object.values(this.fleet).filter(({ main }) => main).map(({ name }) => {
          return { value: name, text: name }
        })
      ]
    }
  },

  async beforeMount () {
    await this.getInvTypes()
  },
  methods: {
    /**
     * Parse fleet log to object
     * @param {Event} event
     */
    async parseLog (event) {
      this.prices = {}
      this.fleet = {}
      this.baseInfo = {}
      event.preventDefault()

      const text = this.logText
      const rows = text.split('\n')

      rows.shift() // remove headers row

      const fleet = { }

      for (const row of rows) {
        const [ , character, itemType, quantityValue, itemGroup ] = row.split('\t')

        if (character && this.itemsFilter.includes(itemGroup)) {
          const characterRecord = fleet.hasOwnProperty(character)
            ? fleet[character]
            : { items: {}, name: character, alts: [], main: true }

          if (characterRecord.items.hasOwnProperty(itemType)) {
            const { quantity: prevQuantity, volume, prices } = characterRecord.items[itemType]

            const quantity = prevQuantity + parseInt(quantityValue)

            characterRecord.items[itemType] = {
              itemType,
              quantity,
              itemGroup,
              totalVolume: Math.round(prevQuantity + parseInt(quantity) * volume),
              totalPrice: this.roundPrice(quantity * prices.fastSelPrice)
            }
          } else {
            const baseInfo = await this.getBaseInfo(itemType)
            const prices = await this.getPrice(baseInfo.typeID)
            const quantity = parseInt(quantityValue)

            characterRecord.items[itemType] = {
              itemType,
              quantity,
              itemGroup,
              ...baseInfo,
              prices,
              totalVolume: Math.round(parseInt(quantity) * baseInfo.volume),
              totalPrice: this.roundPrice(quantity * prices.fastSelPrice)
            }
          }

          fleet[character] = characterRecord
        }
      }

      this.fleet = fleet
    },
    /**
     * Move alt into main character
     * @param {Event} event
     */
    onSelectAlt (event) {
      event.preventDefault()

      const mainCharacter = event.target.value
      const altCharacter = event.target.dataset['character']

      const mainRecord = this.fleet[mainCharacter]
      const altRecord = this.fleet[altCharacter]

      altRecord.main = false

      const totalItems = { ...mainRecord.items }
      const altItems = altRecord.items

      for (const { itemType, quantity: addedQuantity, itemGroup, ...baseInfo } of Object.values(altItems)) {
        if (totalItems.hasOwnProperty(itemType)) {
          const { quantity: prevQuantity } = altItems[itemType]

          const quantity = prevQuantity + addedQuantity

          totalItems[itemType] = {
            itemType,
            quantity,
            itemGroup,
            ...baseInfo,
            totalVolume: Math.round(quantity * baseInfo.volume),
            totalPrice: this.roundPrice(quantity * baseInfo.prices.fastSelPrice)
          }
        } else {
          const quantity = addedQuantity

          totalItems[itemType] = {
            itemType,
            quantity,
            itemGroup,
            ...baseInfo,
            totalVolume: Math.round(quantity * baseInfo.volume),
            totalPrice: this.roundPrice(quantity * baseInfo.prices.fastSelPrice)
          }
        }
      }

      mainRecord.alts.push(altCharacter)
      mainRecord.totalItems = totalItems
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
          const { success, data, message } = await esi.fetchOrdersByTypeId(typeId)

          if (!success) {
            // TODO: send alert with message
            console.error(message)
            return {
              avgBuyPrice: 0,
              avgSelPrice: 0,
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

            const maxBuyOrders = buy.sort((a, b) => b.price - a.price).slice(0, 3)
            const minSellOrders = sell.sort((a, b) => a.price - b.price).slice(0, 3)

            const avgBuyPrice = this.getAvgPrice(maxBuyOrders)
            const avgSelPrice = this.getAvgPrice(minSellOrders)
            const fastBuyPrice = this.getAvgPrice(maxBuyOrders.slice(0, 1))
            const fastSelPrice = this.getAvgPrice(minSellOrders.slice(0, 1))

            const prices = {
              avgBuyPrice,
              avgSelPrice,
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
     * Fetch baseInfo table
     * @returns {Promise<void>}
     */
    async getInvTypes () {
      const { success, data, message } = await sde.fetchInvTypes()

      if (success) {
        this.invTypes = data.reduce((types, value) => {
          types[value.typeName] = value
          return types
        })
      } else {
        // TODO: show message alert
        console.error(message)
      }
    }
  }
}
</script>
