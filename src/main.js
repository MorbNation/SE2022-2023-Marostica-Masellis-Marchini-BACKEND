import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import DateFormat from '@voidsolutions/vue-dateformat'

const app = createApp(App);

app.use(DateFormat);
app.use(router);

app.mount('#app');