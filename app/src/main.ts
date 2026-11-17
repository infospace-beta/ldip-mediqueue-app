import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import App from "@/App.vue";
import { useTheme } from "@/composables/useTheme";
import { useAuthStore } from "@/stores";

import "@/assets/styles/tailwind.css";
import "@/assets/styles/public.css";

useTheme();

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  // Validate a saved access token before the router opens protected pages.
  await useAuthStore(pinia).initializeSession();

  app.use(router);
  app.mount("#app");
}

void bootstrap();
