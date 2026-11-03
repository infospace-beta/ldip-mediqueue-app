import "vue-router";
import type { UserRole } from "@/types/models";

/**
 * Typed route meta: a typo in `meta` is a compile error, and the guard gets
 * autocompletion for what it may check.
 */
declare module "vue-router" {
  interface RouteMeta {
    /**Redirects to /login when there is no session */
    requiresAuth?: boolean;
    /**Redirects signed-in users away, e.g. the login page */
    guestOnly?: boolean;
    /**Roles allowed to access a route and its children */
    roles?: UserRole[];
    /**Which shell renders this route; defaults to the app chrome */
    layout?: "default" | "auth" | "blank";
  }
}
