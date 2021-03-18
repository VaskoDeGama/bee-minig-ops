<template>
  <b-card v-if="oreParsed" footer-class="p-2" no-body class="mb-3">
    <template #header>
      <b-row class="d-flex justify-content-center align-items-center ">
        <h4 class="mb-0">{{ compressed ? 'Compressed ' : '' }}Ores</h4>

      </b-row></template>
    <div class="d-flex flex-column  justify-content-center align-items-center">
      <b-table class="p-0 m-0" striped hover :fields="itemsFields" :items="Object.values(ores.items)">
        <template #cell(totalVolume)="data">
        {{ numberToEveFormat(data.item.quantity * data.item.typeVolume, 'm3') }}
        </template>
        <template #cell(totalPrice)="data">
          {{ numberToEveFormat(data.item.prices.buy.max * data.item.quantity, 'ISK') }}
        </template>
      </b-table>
    </div>

    <template #footer>

        <b-row>
          <b-col>
            Total volume: <span class="font-weight-bold">{{ numberToEveFormat(ores.totals.volume, 'm3') || '' }}</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            Total buy isk: <span class="font-weight-bold">{{ numberToEveFormat(ores.totals.buy, 'ISK') || '' }}</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            Total sel isk: <span class="font-weight-bold">{{ numberToEveFormat(ores.totals.sell, 'ISK') || '' }}</span>
          </b-col>
        </b-row>
    </template>
  </b-card>
</template>

<script>
import { numberToEveFormat } from '../utils'

export default {
  name: 'OreTable',
  props: ['ores', 'oreParsed', 'compressed'],
  data () {
    return {
      itemsFields: [
        { key: 'name', sortable: true },
        { key: 'quantity', sortable: true },
        { key: 'totalVolume',
          label: 'Volume',
          sortable: true },
        { key: 'totalPrice',
          label: 'Price',
          sortable: true }
      ]
    }
  },
  methods: {
    numberToEveFormat: numberToEveFormat
  }
}
</script>

<style scoped>

</style>
