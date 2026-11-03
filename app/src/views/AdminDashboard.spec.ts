import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";
import { useTheme } from "@/composables/useTheme";
import { authGuard } from "@/router/guards";
import { routes } from "@/router/routes";
import { hospitalManagementService } from "@/services/hospitalManagement.service";
import { useAuthStore } from "@/stores/auth.store";
import type { UserRole } from "@/types/models";
import AdminDashboard from "@/views/AdminDashboard.vue";

vi.mock("@/services/hospitalManagement.service", () => ({
  hospitalManagementService: {
    getHospitals: vi.fn(),
    registerHospital: vi.fn(),
  },
}));

describe("AdminDashboard", () => {
  let wrapper: VueWrapper | undefined;

  beforeEach(() => {
    localStorage.clear();
    useTheme().setTheme("system");
    setActivePinia(createPinia());
    window.innerWidth = 390;
    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([]);
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  function signInAs(role: UserRole) {
    useAuthStore().user = {
      id: 8,
      username: "admin@example.test",
      firstName: "Avery",
      lastName: "Admin",
      role,
    };
  }

  function createDestination(path: string): RouteLocationNormalized {
    const record = routes.find((entry) => entry.path === path);
    return {
      fullPath: path,
      matched: [{ meta: record?.meta ?? {} }],
      meta: record?.meta ?? {},
    } as unknown as RouteLocationNormalized;
  }

  const runGuard = (destination: RouteLocationNormalized) =>
    (authGuard as (to: RouteLocationNormalized) => unknown)(destination);

  async function mountDashboard() {
    const pinia = createPinia();
    setActivePinia(pinia);
    signInAs("admin");
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: ROUTE_NAMES.landing,
          component: { template: "<main>Home</main>" },
        },
        { path: "/admin/dashboard", component: AdminDashboard },
      ],
    });
    await router.push("/admin/dashboard");
    await router.isReady();
    wrapper = mount(AdminDashboard, {
      attachTo: document.body,
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    return { dashboard: wrapper, router };
  }

  it("renders the admin overview without fabricated operational data", async () => {
    const { dashboard } = await mountDashboard();

    expect(dashboard.get(".admin-brand-mark img").attributes("src")).toBe(
      "/mediqueue-logo.png",
    );
    expect(dashboard.get("h1").text()).toBe("Overview");
    expect(dashboard.get("h2").text()).toBe("Hospital administration overview");
    expect(dashboard.text()).toContain("Administration service not connected.");
    expect(dashboard.text()).toContain("No administrative data available");
    expect(dashboard.find(".admin-metric-grid").exists()).toBe(false);
    expect(dashboard.findAll("table")).toHaveLength(0);
    expect(dashboard.text()).not.toContain("Demo");
    expect(dashboard.text()).not.toContain("Sample");
  });

  it.each([
    ["User Management", "User data unavailable"],
    ["Hospital Management", "Hospital directory"],
    ["Department Management", "Department data unavailable"],
    ["Medical Staff", "Medical staff data unavailable"],
    ["Appointment Oversight", "Appointment data unavailable"],
    ["Queue Oversight", "Queue data unavailable"],
    ["Emergency Oversight", "Emergency data unavailable"],
    ["System Settings", "System settings unavailable"],
  ])(
    "navigates to %s and shows the honest unavailable state",
    async (label) => {
      const { dashboard } = await mountDashboard();
      const navButton = dashboard
        .findAll(".admin-nav-link")
        .find((button) => button.text().includes(label));

      expect(navButton).toBeDefined();
      await navButton!.trigger("click");

      expect(dashboard.get("h1").text()).toBe(label);
      expect(
        dashboard.find(".admin-nav-link-active").attributes("aria-current"),
      ).toBe("page");
      if (label === "Hospital Management") {
        expect(dashboard.find("#hospital-management-title").text()).toBe(label);
        expect(dashboard.find("#hospital-registration-title").exists()).toBe(
          true,
        );
        return;
      }
      expect(dashboard.text()).toContain("Awaiting integration");
      expect(dashboard.text()).toContain("will appear here");
      expect(dashboard.findAll("table")).toHaveLength(0);
    },
  );

  it("supports responsive navigation state and Escape dismissal", async () => {
    const { dashboard } = await mountDashboard();
    const menuButton = dashboard.get(".admin-menu-button");

    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(menuButton.attributes("aria-controls")).toBe("admin-navigation");
    expect(dashboard.get(".admin-sidebar").attributes("inert")).toBeDefined();

    await menuButton.trigger("click");
    await flushPromises();
    expect(menuButton.attributes("aria-expanded")).toBe("true");
    expect(dashboard.get(".admin-sidebar").classes()).toContain(
      "admin-sidebar-open",
    );
    expect(dashboard.get(".admin-sidebar").attributes("inert")).toBeUndefined();
    expect(document.activeElement).toBe(
      dashboard.get(".admin-navigation .admin-nav-link").element,
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(dashboard.get(".admin-sidebar").classes()).not.toContain(
      "admin-sidebar-open",
    );
    expect(dashboard.get(".admin-sidebar").attributes("inert")).toBeDefined();
    expect(document.activeElement).toBe(menuButton.element);
  });

  it("keeps the admin sidebar interactive at desktop widths", async () => {
    window.innerWidth = 1280;
    const { dashboard } = await mountDashboard();

    expect(dashboard.get(".admin-sidebar").attributes("inert")).toBeUndefined();
    expect(dashboard.get(".admin-sidebar").classes()).not.toContain(
      "admin-sidebar-open",
    );
    expect(dashboard.get(".admin-navigation .admin-nav-link").isVisible()).toBe(
      true,
    );
  });

  it("uses the shared theme preference and updates the root theme", async () => {
    const { dashboard } = await mountDashboard();
    const theme = useTheme();

    await dashboard.get('button[aria-label="Light theme"]').trigger("click");
    expect(theme.preference.value).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(
      dashboard
        .get('button[aria-label="Light theme"]')
        .attributes("aria-pressed"),
    ).toBe("true");

    await dashboard.get('button[aria-label="Dark theme"]').trigger("click");
    expect(theme.preference.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(
      dashboard
        .get('button[aria-label="Dark theme"]')
        .attributes("aria-pressed"),
    ).toBe("true");
  });

  it("displays only the signed-in session username in the account area", async () => {
    const { dashboard } = await mountDashboard();

    expect(dashboard.text()).toContain("admin@example.test");
    expect(dashboard.text()).not.toContain("Avery Admin");

    useAuthStore().user = null;
    await flushPromises();
    expect(dashboard.text()).toContain("Profile information unavailable.");
  });

  it("preserves the admin path and restricts it to the admin role", () => {
    const adminRoute = routes.find(
      (entry) => entry.name === ROUTE_NAMES.adminDashboard,
    );

    expect(adminRoute?.path).toBe("/admin/dashboard");
    expect(adminRoute?.meta).toMatchObject({
      requiresAuth: true,
      roles: ["admin"],
    });

    const destination = createDestination("/admin/dashboard");
    signInAs("admin");
    expect(runGuard(destination)).toBe(true);

    signInAs("doctor");
    expect(runGuard(destination)).toEqual({
      name: ROUTE_NAMES.doctorDashboard,
    });
  });

  it("logs out through the existing auth session and returns to landing", async () => {
    const { dashboard, router } = await mountDashboard();

    await dashboard
      .findAll(".admin-nav-link")
      .find((button) => button.text().includes("Log out"))
      ?.trigger("click");
    expect(useAuthStore().user).not.toBeNull();
    document.body
      .querySelector(".confirmation-dialog button:last-child")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    expect(useAuthStore().user).toBeNull();
    expect(router.currentRoute.value.path).toBe("/");
  });
});
