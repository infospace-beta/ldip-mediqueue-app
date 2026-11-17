import { describe, it, expect, beforeEach } from "vitest";
import type { RouteLocationNormalized } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import { authGuard } from "@/router/guards";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

/**Minimal stand-in for a resolved route */
const route = (
  fullPath: string,
  meta: Record<string, unknown> = {},
): RouteLocationNormalized =>
  ({
    fullPath,
    matched: [{ meta }],
    meta,
  }) as unknown as RouteLocationNormalized;

/**The guard is typed as a navigation guard; call it directly in tests */
const run = (to: RouteLocationNormalized) =>
  (authGuard as (to: RouteLocationNormalized) => unknown)(to);

const signIn = (role: "patient" | "responder" = "patient") => {
  useAuthStore().user = {
    id: 1,
    username: "test@gmail.com",
    firstName: "Test",
    lastName: "User",
    role,
  };
  useAuthStore().token = "test-access-token";
};

describe("authGuard", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("lets anyone through to a public route", () => {
    expect(run(route("/"))).toBe(true);
  });

  it("redirects to login with a returnUrl when signed out", () => {
    const result = run(route("/posts", { requiresAuth: true }));

    expect(result).toEqual({
      name: ROUTE_NAMES.login,
      query: { returnUrl: "/posts" },
    });
    expect(useAuthStore().returnUrl).toBe("/posts");
  });

  it("allows a guarded route once signed in", () => {
    signIn();

    expect(run(route("/posts", { requiresAuth: true }))).toBe(true);
  });

  it("allows a patient route only for the patient role", () => {
    signIn("patient");

    expect(
      run(route("/patient/dashboard", { requiresAuth: true, roles: ["patient"] })),
    ).toBe(true);
  });

  it("redirects a user away from another role's route", () => {
    signIn("patient");

    expect(
      run(route("/responder/dashboard", { requiresAuth: true, roles: ["responder"] })),
    ).toEqual({ name: ROUTE_NAMES.patientDashboard });
  });

  it.each([undefined, "unknown"])(
    "clears a session with a missing or unknown role (%s)",
    (role) => {
      useAuthStore().user = {
        id: 8,
        username: "stale@example.test",
        firstName: "Stale",
        lastName: "Session",
        role,
      } as never;

      expect(run(route("/patient/dashboard", { requiresAuth: true }))).toEqual({
        name: ROUTE_NAMES.login,
        query: { returnUrl: "/patient/dashboard" },
      });
      expect(useAuthStore().user).toBeNull();
    },
  );

  it("keeps a signed-in user off the login page", () => {
    signIn();

    expect(run(route("/login", { guestOnly: true }))).toEqual({
      name: ROUTE_NAMES.patientDashboard,
    });
  });
});
