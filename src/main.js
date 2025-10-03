import './assets/main.css'
import router from './router'
import vuetify from './plugins/vuetify'

import { createApp } from 'vue'
import App from './components/App.vue'

createApp(App).use(router).use(vuetify).mount('#app')
