<template>
    <b-navbar type="dark" variant="dark" class="w-100" >
      <b-navbar-brand to="/">Stone miners tools</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/parser">Fleet log parser</b-nav-item>
            <b-nav-item to="/compression">Ore compression</b-nav-item>
          </b-navbar-nav>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>

</style>
