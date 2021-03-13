<template>
  <div v-if="character.isMain">
    <b-row class="d-flex flex-row justify-content-between align-items-center">

      <b-col class="d-flex  justify-content-start align-items-baseline">
        <h5 >
          <b-button
              v-if="!hasOrca || character.isOrca"
              size="sm"
              :variant="character.isOrca ? 'success' :'light'"
              @click="onOrcaChange(character.name)">Orca
          </b-button>
          {{ character.name }}
        </h5>
        <span v-if="character.alts.length > 0" class="ml-3">{{ 'Alts: ' + character.alts.join(', ') }}</span></b-col>

      <b-col class="d-flex flex-row justify-content-end align-items-baseline">
        <b-form-group
            v-if="(character.alts.length === 0) && !character.isOrca"
            class="m-0"
            label-cols="auto"
            label-align="right"
            label-size="sm"
            label="Main character(if need):"
            label-for="selectMain"
            valid-feedback="Thank you!">
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
        </b-form-group>

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
    <b-row>
      <b-table striped hover :fields="itemsFields" :items="Object.values(character.totalItems || character.items)">

      </b-table>
    </b-row>

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
        { key: 'quantity', sortable: true },
        { key: 'totalVolume',
          label: 'Total volume',
          sortable: true,
          formatter: (value) => {
            const str = value.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ',')

            return `${str} m3`
          } },
        { key: 'totalPrice',
          label: 'Total price',
          sortable: true,
          formatter: (value) => {
            const str = value.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ',')

            return `${str} ISK`
          } }
      ]
    }
  }

}
</script>

<style scoped>

</style>
