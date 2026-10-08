import type { NavigationGuardWithThis } from "vue-router";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

/**
 * Auth guard.
 *
 * The session lives in localStorage (see stores/auth.store.ts), so it is already
 * restored by the time this runs - there is nothing to await. If you move to a
 * provider that has to be asked (Supabase, a /me endpoint), await that call here
 * before the checks below.
 */
export const authGuard: NavigationGuardWithThis<undefined> = (to) => {
  const auth = useAuthStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  /**Guarded route, no session: send them to login and remember where they wanted to go */
  if (requiresAuth && !auth.isLoggedIn) {
    auth.returnUrl = to.fullPath;
    return { name: ROUTE_NAMES.login, query: { returnUrl: to.fullPath } };
  }

  /**Already logged in: keep them off the login page */
  if (guestOnly && auth.isLoggedIn) {
    return { name: ROUTE_NAMES.home };
  }

  return true;
};
