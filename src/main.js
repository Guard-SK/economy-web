import { createApp } from 'vue'
import App from './app/App.vue'
import router from './router'
import store from './store'

import PrimeVue from 'primevue/config'
import Password from 'primevue/password'
import Dialog from 'primevue/dialog'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import '../src/style/main.css'

const app = createApp(App)
app
    .use(store)
    .use(router)
    .use(PrimeVue)
    .component('PPassword', Password)
    .component('PDialog', Dialog)
.mount('#app')
