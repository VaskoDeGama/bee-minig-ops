<template>
  <div v-if="character.isMain">
    <b-row class="d-flex flex-row justify-content-between align-items-center">

      <b-col class="d-inline-flex flex-row justify-content-start align-items-center">
        <h5>
          <b-button
              v-if="!hasOrca || character.isOrca"
              size="sm"
              :variant="character.isOrca ? 'success' :'light'"
              @click="onOrcaChange(character.name)">Orca
          </b-button>
          {{ character.name }}
        </h5>
        <span v-if="character.alts.length > 0" class="ml-3">{{ 'Alts: ' + character.alts.join(', ') }}</span></b-col>

      <b-col cols="2" class="d-flex justify-content-end align-items-center">
        <b-form-select
            v-if="(character.alts.length === 0) && !character.isOrca"
            v-b-tooltip.hover
            :options="options.filter(({value}) => value !== character.name)"
            :value="null"
            size="sm"
            title="Select an main character if need"
            :data-character="character.name"
            @change.native="onSelectAlt">
        </b-form-select>

      </b-col>

      <b-col cols="1" class="d-flex justify-content-end align-items-center">
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
    <b-table striped hover :fields="itemsFields" :items="Object.values(character.totalItems || character.items)">

    </b-table>
  </div>
</template>

<script>
export default {
  name: 'CharacterTable',
  props: ['character', 'onSelectAlt', 'options', 'onOrcaChange', 'hasOrca', 'onDeleteHauler'],
  data () {
    return {
      itemsFields: [
        { key: 'itemType', sortable: true },
        { key: 'itemGroup', sortable: true },
        { key: 'quantity', sortable: true },
        { key: 'volume', label: 'Volume per item', sortable: true },
        { key: 'totalVolume', label: 'Total volume', sortable: true },
        {
          key: 'prices',
          label: 'Prices',
          sortable: true,
          formatter: (value) => value.fastSelPrice
        },
        { key: 'totalPrice', label: 'Total price', sortable: true }
      ]
    }
  }

}
</script>

<style scoped>

</style>
