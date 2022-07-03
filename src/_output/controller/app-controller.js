import App from '@/_output/vue/app.vue'
import { createApp } from 'vue'

export default class AppController {
  constructor (fullData) {
    const app = createApp(App)
    app.provide('$fullData', fullData)

    app.mount('#alpheios-alignment-editor-output') 
  }
}
