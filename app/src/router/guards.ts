import type { NavigationGuardWithThis } from "vue-router";
import { useAuthStore } from "@/stores";
import { ROLE_DASHBOARD_NAMES, ROUTE_NAMES } from "@/constants/routeNames";
import { isUserRole } from "@/types/models";

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

  if (auth.user && !isUserRole(auth.user.role)) auth.logout();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  /**Guarded route, no session: send them to login and remember where they wanted to go */
  if (requiresAuth && !auth.isLoggedIn) {
    auth.returnUrl = to.fullPath;
    return { name: ROUTE_NAMES.login, query: { returnUrl: to.fullPath } };
  }

  /**Already logged in: keep them off the login page */
  if (guestOnly && auth.isLoggedIn) {
    const role = auth.user?.role;
    return role && isUserRole(role)
      ? { name: ROLE_DASHBOARD_NAMES[role] }
      : { name: ROUTE_NAMES.login };
  }

  const role = auth.user?.role;
  const roleDenied =
    auth.isLoggedIn &&
    isUserRole(role) &&
    to.matched.some(
      (record) => record.meta.roles && !record.meta.roles.includes(role),
    );
  if (roleDenied && role && isUserRole(role)) {
    return { name: ROLE_DASHBOARD_NAMES[role] };
  }

  return true;
};
