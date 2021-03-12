'use strict'

import Vue from 'vue'
import Main from './layouts/index.vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './assets/style.scss'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({ // eslint-disable-line
  el: '#app',
  components: { Main },
  data () {
    return {
      bus: new Vue()
    }
  },

  created () {

  },

  template: '<Main :bus="bus"/>'
})
