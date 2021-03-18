'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import MainLayout from './layouts/main-layout.vue'
import { FleetLogParser, Main, NotFound, OreCompression } from './components'
import './assets/style.scss'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const routes = [
  { path: '/', component: Main },
  { path: '/parser', component: FleetLogParser },
  { path: '/compression', component: OreCompression },
  { path: '*', component: NotFound }

]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({ // eslint-disable-line
  router,
  el: '#app',
  components: { MainLayout },
  data () {
    return {
      bus: new Vue()
    }
  },

  template: '<MainLayout :bus="bus"/>'
})
