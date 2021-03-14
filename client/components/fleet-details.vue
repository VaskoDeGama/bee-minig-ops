<template>
<div v-if="fleetParsed" class="d-flex flex-column justify-content-between align-items-stretch">
    <h5 class="align-self-center">Fleet member details</h5>
    <CharacterTable v-for="(character, characterName) in fleet" :key="characterName"
    :on-select-alt="onSelectAlt"
    :on-orca-change="onOrcaChange"
    :on-delete-hauler="onDeleteHauler"
    :has-orca="hasOrca"
    :character="character"
    :options="options"/>
</div>
</template>

<script>
import CharacterTable from './character-table.vue'

export default {
  name: 'FleetDetails',
  components: {
    CharacterTable

  },
  props: ['fleet', 'onSelectAlt', 'onOrcaChange', 'hasOrca', 'onDeleteHauler', 'fleetParsed'],
  computed: {
    options: function () {
      return [
        ...Object.values(this.fleet).filter(({ isMain }) => isMain).map(({ name }) => {
          return { value: name, text: name }
        })
      ]
    }
  }
}
</script>

<style scoped>

</style>
