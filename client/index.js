'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import MainLayout from './layouts/main-layout.vue'
import { FleetLogParser, Main, NotFound } from './components'
import './assets/style.scss'
import services from './services'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const routes = [
  { path: '/', component: Main },
  { path: '/parser', component: FleetLogParser },
  { path: '*', component: NotFound }

]

const router = new VueRouter({
  mode: 'history',
  routes
})

Vue.prototype.$api = services

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
