import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    dark: true
  },
  iconfont: 'mdi'
})

export default vuetify