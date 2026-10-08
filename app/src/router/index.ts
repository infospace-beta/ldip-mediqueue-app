import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import { authGuard } from "@/router/guards";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
});

router.beforeEach(authGuard);

export default router;
