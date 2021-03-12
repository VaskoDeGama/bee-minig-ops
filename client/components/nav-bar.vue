<template>
  <div>
    <b-navbar type="dark" variant="dark" >
      <b-navbar-brand href="#">Mining ops tools</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#">Fleet log parser</b-nav-item>
          </b-navbar-nav>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>

</style>
