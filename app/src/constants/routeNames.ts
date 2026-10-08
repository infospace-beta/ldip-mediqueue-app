/**
 * Route names live here so no view or component types a route string twice.
 * Grouped by who can reach them - the source of truth is `meta` in router/routes.ts.
 */
export const ROUTE_NAMES = {
  /**Public */
  landing: "landing",
  about: "about",
  contact: "contact",
  faq: "faq",
  posts: "posts",
  jobs: "jobs",
  notFound: "not-found",

  /**Guests only - signed-in users get bounced away */
  login: "login",

  /**Requires a session */
  home: "home",
  apiTest: "api-test",
  postDetails: "post-details",
  jobDetails: "job-details",
} as const;

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];
