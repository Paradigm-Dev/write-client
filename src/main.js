import Vue from 'vue'
import App from './App.vue'
import vuetify from './vuetify'
import { remote } from 'electron'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    close() {
      this.$root.win.close()
    },
    maximize() {
      this.$root.win.maximize()
      this.$root.maximized = remote.getCurrentWindow().isMaximized()
    },
    unmaximize() {
      this.$root.win.unmaximize()
      this.$root.maximized = remote.getCurrentWindow().isMaximized()
    },
    minimize() {
      this.$root.win.minimize()
    },
    reload() {
      location.reload()
    }
  }
})

new Vue({
  vuetify,
  render: h => h(App),
  data() {
    return {
      notify: {
        is: false,
        text: ''
      },
      win: remote.getCurrentWindow(),
      maximized: remote.getCurrentWindow().isMaximized(),
      contents: remote.getCurrentWebContents(),
      file: {
        title: ''
      }
    }
  }
}).$mount('#app')
