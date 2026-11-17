import type { NavigationGuardWithThis } from "vue-router";
import { useAuthStore } from "@/stores";
import {
  ROLE_DASHBOARD_NAMES,
  ROUTE_NAMES,
} from "@/constants/routeNames";
import { isUserRole } from "@/types/models";

export const authGuard: NavigationGuardWithThis<undefined> = (to) => {
  const auth = useAuthStore();

  const requiresAuth = to.matched.some(
    (record) => record.meta.requiresAuth,
  );

  const guestOnly = to.matched.some(
    (record) => record.meta.guestOnly,
  );

  // A saved user without a token is not an authenticated session.
  if (auth.user && !auth.token) {
    auth.logout();
  }

  // Clear any session containing an unsupported role.
  if (auth.user && !isUserRole(auth.user.role)) {
    auth.logout();
  }

  if (requiresAuth && !auth.isLoggedIn) {
    auth.returnUrl = to.fullPath;

    return {
      name: ROUTE_NAMES.login,
      query: { returnUrl: to.fullPath },
    };
  }

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
      (record) =>
        record.meta.roles &&
        !record.meta.roles.includes(role),
    );

  if (roleDenied && role && isUserRole(role)) {
    return { name: ROLE_DASHBOARD_NAMES[role] };
  }

  return true;
};
