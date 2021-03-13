<template>
  <b-row class="mt-2 mb-2 d-flex flex-row justify-content-between align-items-center">
    <b-col class="d-flex flex-column justify-content-center align-items-center">
      <h2>Page not found!</h2>
      <h4>Go <router-link to="/">home</router-link></h4>
      <div>
        <b-img src="https://cdn.bulbagarden.net/upload/thumb/6/61/015Beedrill.png/600px-015Beedrill.png" fluid></b-img>
      </div>
    </b-col>

  </b-row>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>

</style>
