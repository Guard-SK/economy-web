import { createApp } from 'vue'
import App from './app/App.vue'
import router from './router'
import store from './store'

import './assets/theme/main.scss'
import 'popper.js'

const app = createApp(App)

app
    .use(store)
    .use(router)
.mount('#app')
