<template>
  <b-row class="min-vw-100 mt-3 mb-3 d-flex flex-md-column flex-lg-row  ">
    <b-col md="12" lg="3" class="mb-5">
      <ParseForm :parse-log="parseLog"/>
    </b-col>
    <b-col class="d-flex flex-md-column flex-lg-row justify-content-around align-items-start">
        <OreTable :ore-parsed="oreParsed" :ores="rawOres"/>
        <OreTable :ore-parsed="oreParsed" :ores="compressOres" compressed="true"/>
    </b-col>

  </b-row>
</template>

<script>
import api from '../../services/api'
import ParseForm from '../parse-form.vue'
import OreTable from './ore-table.vue'
import { normalizeString, parseNumber } from '../utils'

export default {
  name: 'OreCompression',
  components: {
    ParseForm,
    OreTable
  },
  data () {
    return {
      rawOres: {},
      compressOres: {},
      oreParsed: false
    }
  },
  methods: {

    async getPrices (type, market) {
      const { success, data, message } = await api.fetchPricesFromEvePrasial(type, market)

      if (success) {
        return data
      } else {
        // TODO show error message
        console.error(message)
        return {}
      }
    },
    async parseLog (logText, market) {
      logText = 'Azure Plagioclase*\t46 738\tPlagioclase*\t\t\t16 358,30 м^3\t3 037 502,62 ISK\n' +
          'Azure Plagioclase*\t76 280\tPlagioclase*\t\t\t26 698 м^3\t4 957 437,20 ISK\n' +
          'Plagioclase*\t18 927\tPlagioclase*\t\t\t6 624,45 м^3\t1 193 915,16 ISK\n' +
          'Plagioclase*\t92 386\tPlagioclase*\t\t\t32 335,10 м^3\t5 827 708,88 ISK\n' +
          'Rich Plagioclase*\t223 950\tPlagioclase*\t\t\t78 382,50 м^3\t15 380 886,00 ISK\n' +
          'Rich Plagioclase*\t42 477\tPlagioclase*\t\t\t14 866,95 м^3\t2 917 320,36 ISK\n' +
          'Concentrated Veldspar*\t127 810\tVeldspar*\t\t\t12 781 м^3\t1 956 771,10 ISK\n' +
          'Concentrated Veldspar*\t45 173\tVeldspar*\t\t\t4 517,30 м^3\t691 598,63 ISK\n' +
          'Dense Veldspar*\t269 824\tVeldspar*\t\t\t26 982,40 м^3\t4 414 320,64 ISK\n' +
          'Veldspar*\t206 607\tVeldspar*\t\t\t20 660,70 м^3\t3 097 038,93 ISK'

      const rows = logText.split('\n')

      const types = []
      const compressTypes = []

      for (const row of rows) {
        const [rawName, rawQuantity] = row.split('\t')

        const name = normalizeString(rawName)
        const quantity = parseNumber(rawQuantity)

        types.push({ name, quantity })
        compressTypes.push(this.convertOreToCompressed(name, quantity))
      }

      this.rawOres = await this.getPrices(types, market)
      this.compressOres = await this.getPrices(compressTypes, market)

      console.log(this.rawOres, this.compressOres)

      this.oreParsed = true
    },
    /**
     *
     * @param {string} name
     * @param {number} quantity
     * @returns {object} {{name: string, quantity: number}}
     */
    convertOreToCompressed (name, quantity) {
      return {
        name: `Compressed ${name}`,
        quantity: Math.floor(quantity / 100)
      }
    }
  }

}
</script>

<style scoped>

</style>
