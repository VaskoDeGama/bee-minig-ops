<template>
  <b-row class="min-vw-100 mt-3 mb-3 d-flex flex-md-column flex-lg-row  ">
    <b-col md="12" lg="3" class="mb-5">
      <ParseForm :parse-log="parseLog"/>
    </b-col>
    <b-col class="d-flex flex-column">

    </b-col>

  </b-row>
</template>

<script>
import api from '../../services/api'

import ParseForm from '../parse-form.vue'
export default {
  name: 'OreCompression',
  components: {
    ParseForm
  },
  methods: {
    parseLog (logText, market) {

    }
  }

}
</script>

<style scoped>

</style>
