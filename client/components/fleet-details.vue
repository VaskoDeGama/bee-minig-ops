<template>
<div>
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
  props: ['fleet', 'onSelectAlt', 'onOrcaChange', 'hasOrca', 'onDeleteHauler'],
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
