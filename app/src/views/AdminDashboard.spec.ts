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
import { mediqueueService } from "@/services/mediqueue.service";
import { useAuthStore } from "@/stores/auth.store";
import type { UserRole } from "@/types/models";
import AdminDashboard from "@/views/AdminDashboard.vue";

vi.mock("@/services/hospitalManagement.service", () => ({
  hospitalManagementService: {
    getHospitals: vi.fn(),
    getHospital: vi.fn(),
    registerHospital: vi.fn(),
  },
}));

vi.mock("@/services/mediqueue.service", () => ({
  mediqueueService: {
    getAdminHospitals: vi.fn(),
    getHospital: vi.fn(),
    getHospitalSummary: vi.fn(),
    getHospitalDepartments: vi.fn(),
    getHospitalStaff: vi.fn(),
    getHospitalDoctorsAdmin: vi.fn(),
    getHospitalEmergencyCases: vi.fn(),
    getDepartmentQueue: vi.fn(),
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    createDepartment: vi.fn(),
    createHospitalStaff: vi.fn(),
    createHospitalDoctor: vi.fn(),
    setDoctorAvailability: vi.fn(),
    resolveEmergency: vi.fn(),
  },
}));

const hospitalFixture = {
  id: 1,
  name: "MediQueue Test Hospital",
  registrationNumber: "TEST-MQ-001",
  hospitalType: "PUBLIC" as const,
  address: "Nakuru",
  county: "Nakuru",
  town: "Nakuru",
  phone: "0700000000",
  email: "test@mediqueue.example",
  status: "ACTIVE" as const,
};

describe("AdminDashboard", () => {
  let wrapper: VueWrapper | undefined;

  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    useTheme().setTheme("system");
    window.innerWidth = 390;

    vi.mocked(mediqueueService.getAdminHospitals).mockResolvedValue([
      hospitalFixture,
    ]);
    vi.mocked(mediqueueService.getHospitalSummary).mockResolvedValue({
      hospitalId: 1,
      waitingTickets: 12,
      averageWaitMinutes: 18,
      openEmergencyCases: 2,
      onDutyDoctors: 4,
    });
    vi.mocked(mediqueueService.getHospitalDepartments).mockResolvedValue([]);
    vi.mocked(mediqueueService.getHospitalStaff).mockResolvedValue([]);
    vi.mocked(mediqueueService.getHospitalDoctorsAdmin).mockResolvedValue([]);
    vi.mocked(mediqueueService.getHospitalEmergencyCases).mockResolvedValue([]);
    vi.mocked(mediqueueService.getDepartmentQueue).mockResolvedValue([]);
    vi.mocked(mediqueueService.getUsers).mockResolvedValue([]);

    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([]);
    vi.mocked(hospitalManagementService.registerHospital).mockResolvedValue({
      id: "1",
      name: "MediQueue Test Hospital",
      hospitalType: "PUBLIC",
      registrationIdentifier: "TEST-MQ-001",
      phone: "0700000000",
      email: "test@mediqueue.example",
      location: {
        address: "Nakuru",
        city: "Nakuru",
        region: "Nakuru",
      },
      status: "active",
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.clearAllMocks();
  });

  function signInAs(role: UserRole) {
    useAuthStore().user = {
      id: 8,
      username: "admin@example.test",
      firstName: "Avery",
      lastName: "Admin",
      role,
      backendRole: "SYSTEM_ADMIN",
      hospitalId: null,
    };
    useAuthStore().token = "test-access-token";
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

  it("renders the live admin overview using returned hospital data", async () => {
    const { dashboard } = await mountDashboard();

    expect(dashboard.get(".admin-brand-mark img").attributes("src")).toBe(
      "/mediqueue-logo.png",
    );
    expect(dashboard.get("h1").text()).toBe("Overview");
    expect(dashboard.text()).toContain("Hospital administration overview");
    expect(dashboard.text()).toContain("MediQueue Test Hospital");
    expect(dashboard.find(".admin-metrics-grid").exists()).toBe(true);
    expect(dashboard.text()).toContain("Waiting tickets");
    expect(dashboard.text()).toContain("12");
    expect(dashboard.text()).toContain("Open emergency cases");
    expect(dashboard.text()).toContain("Doctors on duty");
    expect(dashboard.findAll("table")).toHaveLength(0);
    expect(dashboard.text()).not.toContain("Demo");
    expect(dashboard.text()).not.toContain("Sample");

    expect(mediqueueService.getAdminHospitals).toHaveBeenCalledOnce();
    expect(mediqueueService.getHospitalSummary).toHaveBeenCalledWith(1);
  });

  it.each([
    ["User Management", "No user records"],
    ["Hospital Management", "Hospital directory"],
    ["Department Management", "No department records"],
    ["Medical Staff", "No medical staff records"],
    ["Appointment Oversight", "Hospital-wide appointment listing is not available"],
    ["Queue Oversight", "No queue tickets"],
    ["Emergency Oversight", "No emergency cases"],
    ["System Settings", "System settings are not available"],
  ])("navigates to %s and shows its actual section state", async (label, expectedText) => {
    const { dashboard } = await mountDashboard();
    const navButton = dashboard
      .findAll(".admin-nav-link")
      .find((button) => button.text().includes(label));

    expect(navButton).toBeDefined();
    await navButton!.trigger("click");
    await flushPromises();

    expect(dashboard.get("h1").text()).toBe(label);
    expect(
      dashboard.find(".admin-nav-link-active").attributes("aria-current"),
    ).toBe("page");
    expect(dashboard.text()).toContain(expectedText);

    if (label === "Hospital Management") {
      expect(dashboard.find("#hospital-management-title").exists()).toBe(true);
      expect(dashboard.find("#hospital-directory-title").exists()).toBe(true);
      expect(dashboard.find("#hospital-registration-title").exists()).toBe(true);
    }

    if (label === "User Management") {
      expect(mediqueueService.getUsers).toHaveBeenCalledOnce();
    }
  });

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

  it("displays the signed-in administrator name and backend role", async () => {
    const { dashboard } = await mountDashboard();

    expect(dashboard.text()).toContain("Avery Admin");
    expect(dashboard.text()).toContain("SYSTEM_ADMIN");
    expect(dashboard.text()).not.toContain("Profile information unavailable.");

    useAuthStore().user = null;
    await flushPromises();

    expect(dashboard.text()).toContain("Administrator");
    expect(dashboard.text()).not.toContain("Avery Admin");
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
