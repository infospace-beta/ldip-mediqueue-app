import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import App from "@/App.vue";

import "@/assets/styles/tailwind.css";

/**The fake backend is installed as an axios adapter when VITE_MODE=local,
 * see services/http/client.ts - nothing to bootstrap here. */

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");
