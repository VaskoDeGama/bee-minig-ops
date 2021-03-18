<template>
  <b-form @submit.prevent="parseLog(logText, market)">
    <b-form-group>
      <b-form-textarea
          id="textarea"
          v-model="logText"
          placeholder="Enter fleet log"
          rows="10"
          max-rows="20"/>
      <b-form-select v-model="market" :options="options" size="sm" class="mt-3 mb-3"></b-form-select>
      <b-button type="submit" variant="primary">Parse</b-button>
      <b-button type="reset" variant="danger">Clear</b-button>
    </b-form-group>

  </b-form>
</template>

<script>
export default {
  name: 'ParseForm',
  props: ['parseLog'],
  data () {
    return {
      options: [
        { value: 'jita', text: 'Jita' },
        { value: 'dodixie', text: 'Dodixie' },
        { value: 'perimeter', text: 'Perimeter' },
        { value: 'universe', text: 'Universe' },
        { value: 'amarr', text: 'Ammar' },
        { value: 'rens', text: 'Rens' },
        { value: 'hek', text: 'Hek' }
      ],
      market: 'jita',
      logText: ''
    }
  }
}
</script>

<style scoped>

</style>
