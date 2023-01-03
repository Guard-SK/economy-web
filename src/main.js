import { createApp } from 'vue'
import App from './app/App.vue'
import router from './router'
import store from './store'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Menubar from 'primevue/menubar';
import Dialog from 'primevue/dialog';
import Password from 'primevue/password';
import Divider from 'primevue/divider';
import Checkbox from 'primevue/checkbox';

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import '../src/style/main.css'

const app = createApp(App)

app
    .use(store)
    .use(router)
    .use(PrimeVue)
    .use(ToastService)

    .component('PInputText', InputText)
    .component('PButton', Button)
    .component('PToast', Toast)
    .component('PMenu', Menubar)
    .component('PDialog', Dialog)
    .component('PPassword', Password)
    .component('PDivider', Divider)
    .component('PCheckbox', Checkbox)
.mount('#app')
