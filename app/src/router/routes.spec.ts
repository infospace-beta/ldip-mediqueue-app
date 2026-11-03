import { describe, it, expect } from "vitest";
import { routes } from "@/router/routes";
import { ROUTE_NAMES } from "@/constants/routeNames";

/**
 * Documents which routes are public. If someone puts requiresAuth on a
 * marketing page - or takes it off the dashboard - this fails and says so.
 */
const PUBLIC = [
  ROUTE_NAMES.landing,
  ROUTE_NAMES.howItWorks,
  ROUTE_NAMES.features,
  ROUTE_NAMES.about,
  ROUTE_NAMES.faq,
  ROUTE_NAMES.contact,
  ROUTE_NAMES.posts,
  ROUTE_NAMES.jobs,
  ROUTE_NAMES.notFound,
];

const GUARDED = [
  ROUTE_NAMES.home,
  ROUTE_NAMES.apiTest,
  ROUTE_NAMES.postDetails,
  ROUTE_NAMES.jobDetails,
];

const byName = (name: string) => routes.find((route) => route.name === name);

describe("route table", () => {
  it.each([
    [ROUTE_NAMES.howItWorks, "/how-it-works"],
    [ROUTE_NAMES.features, "/features"],
  ])("registers %s at %s", (name, path) => {
    expect(byName(name)?.path).toBe(path);
  });

  it.each(PUBLIC)("%s is reachable without a session", (name) => {
    const route = byName(name);
    expect(route, `route ${name} is missing`).toBeDefined();
    expect(route?.meta?.requiresAuth).toBeFalsy();
  });

  it.each(GUARDED)("%s requires a session", (name) => {
    expect(byName(name)?.meta?.requiresAuth).toBe(true);
  });

  it("keeps signed-in users off the login page", () => {
    expect(byName(ROUTE_NAMES.login)?.meta?.guestOnly).toBe(true);
  });

  it("registers signup as a guest-only auth page", () => {
    const signup = byName(ROUTE_NAMES.signup);

    expect(signup?.path).toBe("/signup");
    expect(signup?.meta?.guestOnly).toBe(true);
    expect(signup?.meta?.layout).toBe("auth");
  });

  it("requires authentication for responder workspace routes", () => {
    const responderRoute = routes.find((route) => route.path === "/responder");

    expect(responderRoute?.meta?.requiresAuth).toBe(true);
    expect(responderRoute?.meta?.roles).toEqual(["responder"]);
  });

  it("restricts the patient portal and role previews to their matching roles", () => {
    const patientRoute = routes.find((route) => route.path === "/patient");
    const roleRoutes = [
      ["/doctor/dashboard", "doctor"],
      ["/staff/dashboard", "staff"],
      ["/admin/dashboard", "admin"],
    ] as const;

    expect(patientRoute?.meta?.requiresAuth).toBe(true);
    expect(patientRoute?.meta?.roles).toEqual(["patient"]);
    roleRoutes.forEach(([path, role]) => {
      const route = routes.find((entry) => entry.path === path);
      expect(route?.meta?.requiresAuth).toBe(true);
      expect(route?.meta?.roles).toEqual([role]);
    });
  });

  it("lazy-loads every view so each page is its own chunk", () => {
    routes.forEach((route) => {
      expect(typeof route.component, `${String(route.name)} is not lazy`).toBe(
        "function",
      );
    });
  });
});
