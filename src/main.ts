import { createApp } from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify.ts";
import "./style.css";

createApp(App)
  .use(vuetify)
  .mount('#app')
