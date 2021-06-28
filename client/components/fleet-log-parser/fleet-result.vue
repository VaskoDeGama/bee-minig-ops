<template>
  <b-card v-if="fleetParsed" footer-class="p-2" no-body class="mb-3">
    <template #header>
      <b-row class="d-flex justify-content-center align-items-center ">
        <h4 class="mb-0">Mining ops result</h4>

    </b-row></template>
    <div class="d-flex flex-column  justify-content-center align-items-center">
      <h5 class="mt-2">Members personal result</h5>
      <b-table class="p-0 mb-2" striped hover bordered :fields="membersFields" :items="Object.values(fleetTotal.mainPilots)">
        <template #cell(name)="data">
          <b class="text-info">{{ data.item.name }}</b> <b-badge v-if="data.item.name === fleetTotal.orca" variant="success">orca</b-badge>
        </template>
      </b-table>
      <h5>Fleet result</h5>
      <b-table class="p-0 m-0" striped hover :fields="itemsFields" :items="Object.values(fleetTotal.totalItems)"></b-table>
    </div>

    <template #footer>
      <b-row class="d-flex justify-content-around align-items-center">

        <b-col class="d-flex justify-content-center align-items-center">Total volume: <span class="font-weight-bold">{{ formatter(fleetTotal.totalVolume, 'm3') || '' }}</span></b-col>
        <b-col>Total isk: <span class="font-weight-bold">{{ formatter(fleetTotal.totalPrice, 'ISK') || '' }}</span></b-col>
      </b-row>
    </template>
  </b-card>
</template>

<script>
import { createItemRecord, roundPrice, updateItemRecord, numberToEveFormat, dateToLongString } from '../utils'

export default {
  name: 'FleetResult',
  props: ['fleet', 'fleetParsed'],
  data () {
    return {
      membersFields: [
        { key: 'name',
          label: 'Main character'
        },
        {
          key: 'totalVolume',
          label: 'Total volume',
          sortable: true,
          formatter: (value) => numberToEveFormat(value, 'm3')
        },
        { key: 'alts',
          label: 'Alts characters',
          formatter: (value) => {
            return value.length > 0 ? value.join(', ') : 'none'
          }
        },
        {
          key: 'totalPrice',
          label: 'Total price',
          sortable: true,
          formatter: (value) => numberToEveFormat(value, 'ISK')
        }
      ],

      itemsFields: [
        { key: 'itemType', sortable: true },
        { key: 'quantity', sortable: true },
        {
          key: 'totalVolume',
          label: 'Total volume',
          sortable: true,
          formatter: (value) => numberToEveFormat(value, 'm3')
        },
        {
          key: 'totalPrice',
          label: 'Total price',
          sortable: true,
          formatter: (value) => numberToEveFormat(value, 'ISK')
        }
      ]
    }
  },
  computed: {
    fleetTotal: function () {
      if (this.fleetParsed) {
        const fleet = Object.values(this.fleet)

        const totalItems = fleet.reduce((items, character) => {
          const altItems = Object.values(character.items)

          for (const { itemType, itemGroup, quantity: addedQuantity, prices } of altItems) {
            if (Reflect.has(items, itemType)) {
              items[itemType] = updateItemRecord(items[itemType], addedQuantity)
            } else {
              items[itemType] = createItemRecord(itemType, itemGroup, addedQuantity, prices)
            }
          }

          return items
        }, {})

        const totalPrice = roundPrice(fleet.reduce((sum, { totalPrice, isMain }) => isMain ? sum + totalPrice : sum, 0))
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
  methods: {
    formatter: numberToEveFormat,
    dateFormatter: dateToLongString
  }
}
</script>

<style scoped>

</style>
