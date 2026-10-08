import type { RouteRecordRaw } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";

/**
 * Route table. Views are imported lazily so each page becomes its own chunk -
 * never import them through a barrel file, that would defeat code splitting.
 *
 * `meta` is typed in src/types/router.d.ts and read by router/guards.ts:
 *   requiresAuth - redirects to /login, remembering where the user was headed
 *   guestOnly    - bounces signed-in users away (the login page)
 *   layout       - which shell renders it; the default is the app chrome
 *
 * A route with no `meta.requiresAuth` is public. The list pages below are
 * deliberately public while their detail pages are not: that is the common
 * "browse freely, sign in to go deeper" split, and it exercises the guard's
 * returnUrl round trip.
 */
export const routes: RouteRecordRaw[] = [
  /**PUBLIC */
  {
    path: "/",
    name: ROUTE_NAMES.landing,
    component: () => import("@/views/LandingView.vue"),
  },
  {
    path: "/about",
    name: ROUTE_NAMES.about,
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/faq",
    name: ROUTE_NAMES.faq,
    component: () => import("@/views/FaqView.vue"),
  },
  {
    path: "/contact",
    name: ROUTE_NAMES.contact,
    component: () => import("@/views/ContactView.vue"),
  },
  {
    path: "/posts",
    name: ROUTE_NAMES.posts,
    component: () => import("@/views/PostsView.vue"),
  },
  {
    path: "/jobs",
    name: ROUTE_NAMES.jobs,
    component: () => import("@/views/JobsView.vue"),
  },

  /**GUESTS ONLY */
  {
    path: "/login",
    name: ROUTE_NAMES.login,
    component: () => import("@/views/LoginView.vue"),
    meta: { guestOnly: true, layout: "auth" },
  },

  /**REQUIRES A SESSION */
  {
    path: "/home",
    name: ROUTE_NAMES.home,
    component: () => import("@/views/HomeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/api",
    name: ROUTE_NAMES.apiTest,
    component: () => import("@/views/ApiTestView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/posts/:id",
    name: ROUTE_NAMES.postDetails,
    component: () => import("@/views/PostDetailsView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/jobs/:id",
    name: ROUTE_NAMES.jobDetails,
    component: () => import("@/views/JobDetailsView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },

  /**CATCH-ALL */
  {
    path: "/:pathMatch(.*)*",
    name: ROUTE_NAMES.notFound,
    component: () => import("@/views/NotFoundView.vue"),
    meta: { layout: "blank" },
  },
];
