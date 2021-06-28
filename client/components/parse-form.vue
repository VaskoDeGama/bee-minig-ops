<template>
  <b-form class="ml-3 mr-3" @submit.prevent="parseLog(logText, market)">
    <b-alert variant="warning" class="text-small text-center pb-1 pt-1" show>Works in test mode, so far only with a log from a file.</b-alert>
    <b-form-group class="mb-1">
      <b-form-textarea
          id="textarea"
          v-model="logText"
          placeholder="Insert logs from file here..."
          rows="10"
          max-rows="20"/>
      <b-form-select v-model="market" :options="options" size="sm" class="mt-1 mb-1"></b-form-select>

    </b-form-group>
    <div class="d-flex flex-row justify-content-around align-items-center">
      <b-button type="submit" class="w-50 mr-1" size="sm" variant="primary">Parse</b-button>
      <b-button type="reset" class="w-50 ml-1" size="sm" variant="danger">Clear</b-button>
    </div>
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
