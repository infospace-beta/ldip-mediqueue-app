import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import App from "@/App.vue";
import { useTheme } from "@/composables/useTheme";

import "@/assets/styles/tailwind.css";
import "@/assets/styles/public.css";

/**The fake backend is installed as an axios adapter when VITE_MODE=local,
 * see services/http/client.ts - nothing to bootstrap here. */

useTheme();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");
