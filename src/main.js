import { createApp } from 'vue'
import App from './app/App.vue'
import router from './router'
import store from './store'

import PrimeVue from 'primevue/config'
import Password from 'primevue/password'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import '../src/style/main.css'
import { recalculate } from './globalFunctions';
import './registerServiceWorker'
const app = createApp(App)

app.config.globalProperties.$recalculate = recalculate;
app
    .use(store)
    .use(router)
    .use(PrimeVue)
    .component('PPassword', Password)
    .component('PDialog', Dialog)
    .component('PTable', DataTable)
    .component('PButton', Button)
    .component('PSpinner', ProgressSpinner)
    .mount('#app')
