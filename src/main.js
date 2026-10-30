import { createApp } from 'vue'
import App from './App.vue'
import { magnetic, tilt, scramble } from './composables/directives.js'
import './style.css'

createApp(App)
  .directive('magnetic', magnetic)
  .directive('tilt', tilt)
  .directive('scramble', scramble)
  .mount('#app')
