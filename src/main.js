import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueFeather from 'vue-feather';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPhone, faHouseChimneyMedical } from "@fortawesome/free-solid-svg-icons";
import VueTheMask from 'vue-the-mask'


const app = createApp(App)

library.add(faPhone, faHouseChimneyMedical);

app.component(VueFeather.name, VueFeather);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router)
app.use(store)
app.use(VueTheMask)

app.mount('#app')
