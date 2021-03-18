<template>
  <b-card v-if="character.isMain" header-class="p-2" footer-class="p-2" no-body class="mb-3 p-0">
    <template #header>
      <b-row class="d-flex flex-row justify-content-around align-items-center">

        <b-col v-if="!hasOrca" cols="1">
          <b-button
            size="sm"
            variant="secondary"
            @click="onOrcaChange(character.name)">Orca
        </b-button>
        </b-col>
        <b-col cols="4">
          <h6 class="mb-0" >{{ character.name }} <b-badge v-if="character.isOrca" variant="success">Orca</b-badge></h6>
        </b-col>
        <b-col>
          <span v-if="character.alts.length > 0" class="ml-3">{{ 'Alts: ' + character.alts.map(({name}) => name).join(', ') }}</span>
        </b-col>

        <b-col v-if="(character.alts.length === 0) && !character.isOrca" cols="4">

            <b-form-select
                id="selectMain"
                v-b-tooltip.hover
                :options="options.filter(({value}) => value !== character.name)"
                :value="null"
                size="sm"
                title="Select an main character if need"
                :data-character="character.name"
                @change.native="onSelectAlt">
              <template #first>
                <b-form-select-option :value="null" disabled>--it's main--</b-form-select-option>
              </template>
            </b-form-select>

        </b-col>

        <b-col v-if="!character.isOrca && !character.hasAlts" cols="1" >
          <b-button
              v-b-tooltip.hover
              title="Delete from fleet (e.g. hauler)"
              size="sm"
              variant="light"

              @click="onDeleteHauler(character.name)">
            <b-icon-trash-fill></b-icon-trash-fill>
          </b-button>
        </b-col>
      </b-row>
    </template>

    <b-card-body class="p-0">
        <b-table class="p-0 m-0" striped hover :fields="itemsFields" :items="Object.values(character.items)">

        </b-table>
    </b-card-body>

    <template #footer>
      <b-row class="d-flex flex-row justify-content-around align-items-center">
        <b-col>Total volume: <span class="font-weight-bold">{{ formatter(character.totalVolume, 'm3') || '' }}</span></b-col>
        <b-col>Total isk: <span class="font-weight-bold">{{ formatter(character.totalPrice, 'ISK') || '' }}</span></b-col>
      </b-row>
    </template>

  </b-card>
</template>

<script>
import { numberToEveFormat } from '../utils'

export default {
  name: 'CharacterTable',
  props: ['character', 'onSelectAlt', 'options', 'onOrcaChange', 'hasOrca', 'onDeleteHauler'],
  data () {
    return {
      itemsFields: [
        { key: 'itemType', sortable: true },
        { key: 'quantity', sortable: true },
        { key: 'totalVolume',
          label: 'Total volume',
          sortable: true,
          formatter: (value) => numberToEveFormat(value, 'm3') },
        { key: 'totalPrice',
          label: 'Total price',
          sortable: true,
          formatter: (value) => numberToEveFormat(value, 'ISK') }
      ]
    }
  },
  methods: {
    formatter: numberToEveFormat
  }
}
</script>

<style scoped>

</style>
