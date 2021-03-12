<template>
  <div v-if="character.main">
    <b-row align-content="center">
      <b-col><h4>{{ character.name }}</h4>  <span v-if="character.alts.length > 0">{{ 'Alts: ' + character.alts.join(', ') }}</span> </b-col>
      <b-col>
        <b-form-select
            v-if="character.alts.length === 0"
          :options="options.filter(({value}) => value !== character.name)"
          :value="null"
          size="sm"
          class="mb-3"
          :data-character="character.name"
          @change.native="onSelectAlt">
        <template #first>
          <b-form-select-option :value="null" disabled>-- Please select an main character if need --</b-form-select-option>
        </template>
      </b-form-select>

      </b-col>
    </b-row>
    <b-table striped hover :fields="itemsFields" :items="Object.values(character.totalItems || character.items)">

    </b-table>
  </div>
</template>

<script>
export default {
  name: 'CharacterTable',
  props: ['character', 'onSelectAlt', 'options'],
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
          formatter: (value, key, item) => value.fastSelPrice
        },
        { key: 'totalPrice', label: 'Total price', sortable: true }
      ]
    }
  }

}
</script>

<style scoped>

</style>
