<template>
  <b-row class="m-5">
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
          <CharacterTable
              :character="character"
              :on-select-alt="onSelectAlt"
              :on-orca-change="onOrcaChange"
              :has-orca="hasOrca"
              :options="options"/>
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
          '2021.03.11 17:25\tKomon Okanata\t<localized hint="Arkonor">Arkonor*</localized>\t2814\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tDiana Udan\t<localized hint="Arkonor">Arkonor*</localized>\t3167\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:24\tMina Cepesh\t<localized hint="Arkonor">Arkonor*</localized>\t12827\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tznaxar Lemmont\t<localized hint="Arkonor">Arkonor*</localized>\t1200\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tNIKOJIA SPIRTOVKIN\t<localized hint="Arkonor">Arkonor*</localized>\t3447\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tAloxalola\t<localized hint="Arkonor">Arkonor*</localized>\t578\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tHAnter33\t<localized hint="Arkonor">Arkonor*</localized>\t3026\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 17:26\tAlex Osfar\t<localized hint="Arkonor">Arkonor*</localized>\t744\t<localized hint="Arkonor">Arkonor*</localized>\t\n' +
          '2021.03.11 16:38\tDiana Udan\t<localized hint="Gneiss">Gneiss*</localized>\t2981\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:36\tKomon Okanata\t<localized hint="Gneiss">Gneiss*</localized>\t2580\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:38\tAlex Osfar\t<localized hint="Gneiss">Gneiss*</localized>\t625\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:36\tAloxalola\t<localized hint="Gneiss">Gneiss*</localized>\t456\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:01\tVARATAY\t<localized hint="Neural Network Analyzer">Neural Network Analyzer*</localized>\t10\t<localized hint="Sleeper Components">Компоненты Sleeper*</localized>\t\n' +
          '2021.03.11 16:36\tznaxar Lemmont\t<localized hint="Gneiss">Gneiss*</localized>\t4642\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:26\tAlex Osfar\t<localized hint="Kernite">Kernite*</localized>\t11201\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 16:26\tDiana Udan\t<localized hint="Kernite">Kernite*</localized>\t53000\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 16:36\tNIKOJIA SPIRTOVKIN\t<localized hint="Gneiss">Gneiss*</localized>\t16172\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:26\tKomon Okanata\t<localized hint="Kernite">Kernite*</localized>\t45582\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 16:26\tAloxalola\t<localized hint="Kernite">Kernite*</localized>\t8640\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 15:40\tKomon Okanata\t<localized hint="Bistot">Bistot*</localized>\t2391\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tNIKOJIA SPIRTOVKIN\t<localized hint="Bistot">Bistot*</localized>\t3002\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 16:35\tMina Cepesh\t<localized hint="Kernite">Kernite*</localized>\t200000\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 16:48\tMina Cepesh\t<localized hint="Gneiss">Gneiss*</localized>\t29924\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:36\tHAnter33\t<localized hint="Gneiss">Gneiss*</localized>\t2544\t<localized hint="Gneiss">Gneiss*</localized>\t\n' +
          '2021.03.11 16:26\tHAnter33\t<localized hint="Kernite">Kernite*</localized>\t77289\t<localized hint="Kernite">Kernite*</localized>\t\n' +
          '2021.03.11 14:03\tznaxar Lemmont\t<localized hint="Neural Network Analyzer">Neural Network Analyzer*</localized>\t4\t<localized hint="Sleeper Components">Компоненты Sleeper*</localized>\t\n' +
          '2021.03.11 14:02\tHAnter33\t<localized hint="Neural Network Analyzer">Neural Network Analyzer*</localized>\t6\t<localized hint="Sleeper Components">Компоненты Sleeper*</localized>\t\n' +
          '2021.03.11 16:29\tMina Cepesh\t<localized hint="Bistot">Bistot*</localized>\t23845\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tznaxar Lemmont\t<localized hint="Bistot">Bistot*</localized>\t4067\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tDiana Udan\t<localized hint="Bistot">Bistot*</localized>\t9071\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 14:53\tHAnter33\t<localized hint="Bistot">Bistot*</localized>\t3452\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tAlex Osfar\t<localized hint="Bistot">Bistot*</localized>\t1376\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '2021.03.11 15:40\tAloxalola\t<localized hint="Bistot">Bistot*</localized>\t1380\t<localized hint="Bistot">Bistot*</localized>\t\n' +
          '\n',
      fleet: {},
      baseInfo: {},
      prices: {},
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
        'Spodumain']
    }
  },
  computed: {
    options: function () {
      return [
        ...Object.values(this.fleet).filter(({ isMain }) => isMain).map(({ name }) => {
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
          const characterRecord = fleet.hasOwnProperty(character)
            ? fleet[character]
            : { items: {}, isOrca: false, name: character, alts: [], isMain: true }

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

      altRecord.isMain = false

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
    },
    /**
     * Ser isOrca
     * @param {string} character
     */
    onOrcaChange (character) {
      this.hasOrca = !this.hasOrca
      this.fleet[character].isOrca = !this.fleet[character].isOrca
    }
  }
}
</script>
