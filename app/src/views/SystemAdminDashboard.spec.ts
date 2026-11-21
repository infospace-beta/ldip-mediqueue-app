import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import { useAuthStore } from "@/stores/auth.store";
import {
  systemAdminService,
  type SystemAdminHospital,
  type SystemAdminPage,
  type SystemAdminUser,
} from "@/services/systemAdmin.service";
import SystemAdminDashboard from "@/views/SystemAdminDashboard.vue";

vi.mock("@/services/systemAdmin.service", () => ({
  systemAdminService: {
    getHospitals: vi.fn(),
    createHospital: vi.fn(),
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    getSystemHealth: vi.fn(),
  },
}));

const hospital: SystemAdminHospital = {
  id: 4,
  name: "Central Hospital",
  registrationNumber: "CH-004",
  hospitalType: "PUBLIC",
  address: "1 Health Way",
  county: "Central",
  town: "Medi City",
  phone: null,
  email: null,
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
};

const user: SystemAdminUser = {
  id: 11,
  username: "avery.user",
  email: "avery@example.test",
  fullName: "Avery User",
  role: "PATIENT",
  enabled: true,
  onDuty: false,
  hospitalId: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
};

const hospitalPage: SystemAdminPage<SystemAdminHospital> = {
  content: [hospital],
  page: 0,
  size: 10,
  totalElements: 1,
  totalPages: 1,
  last: true,
};

const userPage: SystemAdminPage<SystemAdminUser> = {
  content: [user],
  page: 0,
  size: 10,
  totalElements: 1,
  totalPages: 1,
  last: true,
};

describe("SystemAdminDashboard", () => {
  let wrapper: VueWrapper | undefined;

  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    useTheme().setTheme("system");
    window.innerWidth = 390;
    vi.clearAllMocks();
    vi.mocked(systemAdminService.getHospitals).mockResolvedValue(hospitalPage);
    vi.mocked(systemAdminService.getUsers).mockResolvedValue(userPage);
    vi.mocked(systemAdminService.createHospital).mockResolvedValue(hospital);
    vi.mocked(systemAdminService.createUser).mockResolvedValue({
      ...user,
      id: 15,
      role: "PATIENT",
    });
    vi.mocked(systemAdminService.updateUser).mockResolvedValue({
      ...user,
      role: "SYSTEM_ADMIN",
      hospitalId: hospital.id,
    });
    vi.mocked(systemAdminService.getSystemHealth).mockResolvedValue({
      status: "UP",
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  async function mountDashboard() {
    const pinia = createPinia();
    setActivePinia(pinia);
   useAuthStore().user = {
  id: 90,
  username: "system.admin",
  firstName: "System",
  lastName: "Administrator",
  role: "admin",
  backendRole: "SYSTEM_ADMIN",
};
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<main>Home</main>" } },
        {
          path: "/system-admin/dashboard",
          component: SystemAdminDashboard,
        },
      ],
    });
    await router.push("/system-admin/dashboard");
    await router.isReady();
    wrapper = mount(SystemAdminDashboard, {
      attachTo: document.body,
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    return wrapper;
  }

  async function navigate(dashboard: VueWrapper, label: string) {
    const item = dashboard
      .findAll(".system-admin-nav-link")
      .find((button) => button.text().includes(label));
    expect(item, `navigation item ${label} exists`).toBeDefined();
    await item!.trigger("click");
    await flushPromises();
  }

  it("shows verified backend totals and the signed-in system administrator", async () => {
    const dashboard = await mountDashboard();

    expect(dashboard.get(".system-admin-brand").text()).toContain(
      "SYSTEM ADMIN",
    );
    expect(dashboard.get("h1").text()).toBe("Overview");
    expect(dashboard.text()).toContain("System Administrator");
    expect(dashboard.text()).toContain("Registered hospitals");
    expect(dashboard.text()).toContain("User accounts");
    expect(systemAdminService.getHospitals).toHaveBeenCalledWith(0, 1);
    expect(systemAdminService.getUsers).toHaveBeenCalledWith(0, 1);
  });

  it("loads the real hospital directory and reports registration only after API success", async () => {
    vi.mocked(systemAdminService.createHospital).mockResolvedValueOnce({
      ...hospital,
      id: 5,
      name: "New Hospital",
    });
    const dashboard = await mountDashboard();
    await navigate(dashboard, "Hospital Management");

    expect(dashboard.text()).toContain("Central Hospital");
    await dashboard
      .get(".system-admin-form-grid input[autocomplete='organization']")
      .setValue("New Hospital");
    await dashboard.get(".system-admin-form-grid").trigger("submit");
    await flushPromises();

    expect(systemAdminService.createHospital).toHaveBeenCalledWith({
      name: "New Hospital",
      hospitalType: "PUBLIC",
      status: "ACTIVE",
    });
    expect(dashboard.text()).toContain("New Hospital was created");
  });

  it("creates users through the backend with the selected numeric hospital assignment", async () => {
    vi.mocked(systemAdminService.createUser).mockResolvedValueOnce({
      ...user,
      id: 15,
      username: "taylor.staff",
      email: "taylor@example.test",
      fullName: "Taylor Staff",
      role: "MEDICAL_STAFF",
      hospitalId: hospital.id,
    });
    const dashboard = await mountDashboard();
    await navigate(dashboard, "User Management");
    await dashboard.get("#system-user-search").setValue("Avery");

    const form = dashboard.findAll(".system-admin-form-grid").at(-1)!;
    await form.get('input[autocomplete="name"]').setValue("Taylor Staff");
    await form.get('input[autocomplete="username"]').setValue("taylor.staff");
    await form
      .get('input[autocomplete="email"]')
      .setValue("taylor@example.test");
    await form
      .get('input[autocomplete="new-password"]')
      .setValue("secure-password");
    await form.find("select").setValue("MEDICAL_STAFF");
    await flushPromises();
    await form.findAll("select").at(1)!.setValue("4");
    await form.trigger("submit");
    await flushPromises();

    expect(systemAdminService.createUser).toHaveBeenCalledWith({
      username: "taylor.staff",
      email: "taylor@example.test",
      fullName: "Taylor Staff",
      role: "MEDICAL_STAFF",
      enabled: true,
      hospitalId: 4,
      password: "secure-password",
      onDuty: false,
    });
    expect(dashboard.text()).toContain("Taylor Staff was created");
  });

  it("updates a backend role and hospital assignment through the authorized user API", async () => {
    const dashboard = await mountDashboard();
    await navigate(dashboard, "Role Management");
    await dashboard.get("#role-11").setValue("HOSPITAL_ADMIN");
    await dashboard.get("#hospital-11").setValue("4");
    await dashboard.get(".system-admin-role-table button").trigger("click");
    await flushPromises();

    expect(systemAdminService.updateUser).toHaveBeenCalledWith(11, {
      username: "avery.user",
      email: "avery@example.test",
      fullName: "Avery User",
      role: "HOSPITAL_ADMIN",
      enabled: true,
      hospitalId: 4,
      onDuty: false,
    });
    expect(dashboard.text()).toContain("Avery User's role was updated");
  });

  it("shows only the aggregate status from the verified health endpoint", async () => {
    const dashboard = await mountDashboard();
    await navigate(dashboard, "System Monitoring");

    expect(systemAdminService.getSystemHealth).toHaveBeenCalledOnce();
    expect(dashboard.text()).toContain("UP");
    expect(dashboard.text()).not.toContain("database");
  });

  it.each([
    ["Audit Logs", "Audit log API unavailable"],
    ["System Settings", "Settings API unavailable"],
  ])(
    "labels %s as unavailable instead of inventing functionality",
    async (label, text) => {
      const dashboard = await mountDashboard();
      await navigate(dashboard, label);

      expect(dashboard.text()).toContain(text);
    },
  );

  it("supports responsive mobile navigation and Escape dismissal", async () => {
    const dashboard = await mountDashboard();
    const menuButton = dashboard.get(".system-admin-menu-button");

    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(
      dashboard.get(".system-admin-sidebar").attributes("inert"),
    ).toBeDefined();
    await menuButton.trigger("click");
    await flushPromises();
    expect(menuButton.attributes("aria-expanded")).toBe("true");
    expect(
      dashboard.get(".system-admin-navigation .system-admin-nav-link").element,
    ).toBe(document.activeElement);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(menuButton.element).toBe(document.activeElement);
  });

  it("keeps the navigation available at desktop widths", async () => {
    window.innerWidth = 1280;
    const dashboard = await mountDashboard();

    expect(
      dashboard.get(".system-admin-sidebar").attributes("inert"),
    ).toBeUndefined();
    expect(dashboard.get(".system-admin-sidebar").isVisible()).toBe(true);
  });
});
