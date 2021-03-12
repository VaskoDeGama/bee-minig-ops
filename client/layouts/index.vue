<template>
  <b-container fluid="true">
    <NavBar/>
    <FleetLogParser/>
  </b-container>
</template>

<script>

import { NavBar, FleetLogParser } from './../components'

export default {
  components: { NavBar, FleetLogParser },

  filters: {},

  props: ['bus'],

  data () {
    return {
      name: ''
    }
  },

  computed: {
    showAlert () {
      return this.name.length > 4
    }
  },

  watch: {},

  beforeDestroy () {

  },

  created () {

  },

  methods: {}
}
</script>

<style scoped>

</style>
