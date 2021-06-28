<template>
  <b-row class="min-vw-100 mt-3 mb-3 d-flex flex-md-column flex-lg-row  ">
    <b-col md="12" lg="3" class="mb-3 d-flex flex-column justify-content-lg-start justify-content-md-center  align-items-md-stretch">
      <h4 class="ml-3 mr-3">Ore compression</h4>
      <ParseForm :parse-log="parseLog"/>
    </b-col>
    <b-col class="d-flex flex-md-column flex-lg-row justify-content-center align-items-lg-start align-items-md-stretch" >
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

    toast (title, message, variant) {
      this.$bvToast.toast(message, {
        title: title,
        toaster: 'b-toaster-top-right',
        solid: true,
        variant
      })
    },

    async getPrices (type, market) {
      const { success, data, message } = await api.fetchPricesFromEvePrasial(type, market)

      if (success) {
        return data
      } else {
        this.toast('Get price failed!', message, 'danger')
        return {}
      }
    },
    async parseLog (logText, market) {
      if (!logText || logText.length < 20 || !/\n/.test(logText)) {
        this.toast('Invalid source text', 'The text you are trying to parse does not match. Try to copy the text from the log file!', 'warning')
        return
      }

      this.oreParsed = false
      this.rawOres = {}
      this.compressOres = {}

      const rows = logText.split('\n')

      console.log(rows)

      const types = []
      const compressTypes = []

      for (const row of rows) {
        const [rawName, rawQuantity] = row.split('\t')

        console.log(rawName, rawQuantity)

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
