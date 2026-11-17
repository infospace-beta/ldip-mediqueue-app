import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import DashboardView from "@/views/DoctorDashboard.vue";
import { authGuard } from "@/router/guards";
import { routes } from "@/router/routes";
import { ROUTE_NAMES } from "@/constants/routeNames";
import { useAuthStore } from "@/stores/auth.store";
import type { UserRole } from "@/types/models";
import {
  filterAppointments,
  filterPatients,
  type DoctorAppointment,
  type DoctorPatient,
} from "@/components/Doctor/doctorDashboard.types";

describe("DoctorDashboard", () => {
  let wrapper: VueWrapper | undefined;

  beforeEach(() => {
    localStorage.clear();
    useTheme().setTheme("system");
    setActivePinia(createPinia());
    window.innerWidth = 390;
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  function signInAs(role: UserRole) {
    useAuthStore().user = {
      id: 8,
      username: "doctor@example.test",
      firstName: "Dana",
      lastName: "Doctor",
      role,
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
    signInAs("doctor");
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<main>Home</main>" } },
        { path: "/doctor/dashboard", component: DashboardView },
      ],
    });
    await router.push("/doctor/dashboard");
    await router.isReady();
    wrapper = mount(DashboardView, {
      attachTo: document.body,
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    return wrapper;
  }

  it("explains the assigned clinical workflows without empty statistic cards", async () => {
    const dashboard = await mountDashboard();

    expect(dashboard.get(".doctor-brand-mark img").attributes("src")).toBe(
      "/mediqueue-logo.png",
    );
    expect(dashboard.get("h1").text()).toBe("Doctor overview");
    expect(dashboard.text()).toContain("Live hospital services connected.");
    expect(dashboard.text()).toContain(
      "No active tickets were returned for your departments.",
    );
    expect(dashboard.text()).toContain(
      "Appointment data is unavailable until the clinical service is connected.",
    );
    expect(dashboard.findAll(".doctor-queue-item")).toHaveLength(0);
    expect(dashboard.findAll(".doctor-table tbody tr")).toHaveLength(0);
    expect(dashboard.find(".doctor-summary-grid").exists()).toBe(false);
    expect(dashboard.text()).not.toContain("DEMO-");
    expect(dashboard.text()).not.toContain("Taylor Sample");
  });

  it("keeps appointment and patient search and filters unavailable until data exists", async () => {
    const dashboard = await mountDashboard();

    await dashboard
      .findAll(".doctor-nav-link")
      .find((button) => button.text().includes("Appointments"))
      ?.trigger("click");

    expect(dashboard.text()).toContain(
      "No doctor appointment-list endpoint is available. Active queue tickets are shown on the overview.",
    );
    expect(
      dashboard.get(
        'input[aria-label="Search appointments or patient records"]',
      ).element,
    ).toHaveProperty("disabled", true);
    expect(
      dashboard.get('select[aria-label="Filter appointments by status"]')
        .element,
    ).toHaveProperty("disabled", true);

    await dashboard
      .findAll(".doctor-nav-link")
      .find((button) => button.text().includes("Patient directory"))
      ?.trigger("click");

    expect(dashboard.text()).toContain(
      "Patient identifiers below are derived from active queue tickets; demographic details are not returned by the queue API.",
    );
    expect(
      dashboard.get(
        'input[aria-label="Search appointments or patient records"]',
      ).element,
    ).toHaveProperty("disabled", true);
    expect(
      dashboard.get('select[aria-label="Filter patients by directory status"]')
        .element,
    ).toHaveProperty("disabled", true);
  });

  it("filters connected appointment and patient records by search and status", () => {
    const appointments: DoctorAppointment[] = [
      {
        id: "appointment-1",
        patientId: "patient-1",
        patientName: "Patient One",
        time: "09:00",
        visitType: "Consultation",
        status: "Waiting",
      },
      {
        id: "appointment-2",
        patientId: "patient-2",
        patientName: "Patient Two",
        time: "10:00",
        visitType: "Follow-up",
        status: "Scheduled",
      },
    ];
    const patients: DoctorPatient[] = [
      {
        id: "patient-1",
        name: "Patient One",
        age: 30,
        lastVisit: "2026-01-01",
        visitType: "Consultation",
        status: "Active",
      },
      {
        id: "patient-2",
        name: "Patient Two",
        age: 40,
        lastVisit: "2026-01-02",
        visitType: "Follow-up",
        status: "Follow-up",
      },
    ];

    expect(filterAppointments(appointments, "two", "All")).toHaveLength(1);
    expect(filterAppointments(appointments, "", "Waiting").at(0)?.id).toBe(
      "appointment-1",
    );
    expect(filterPatients(patients, "two", "All")).toHaveLength(1);
    expect(filterPatients(patients, "", "Active").at(0)?.id).toBe("patient-1");
  });

  it("keeps the mobile navigation control state and target in sync", async () => {
    const dashboard = await mountDashboard();
    const menuButton = dashboard.get(".doctor-menu-trigger");
    const sidebar = dashboard.get(".doctor-sidebar");
    const firstLink = dashboard.get<HTMLButtonElement>(
      ".doctor-navigation .doctor-nav-link",
    );

    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(menuButton.attributes("aria-controls")).toBe(
      "doctor-workspace-navigation",
    );
    expect(sidebar.attributes("inert")).toBeDefined();
    expect(firstLink.element.tabIndex).toBe(0);

    await menuButton.trigger("click");
    await flushPromises();
    await nextTick();

    expect(menuButton.attributes("aria-expanded")).toBe("true");
    expect(dashboard.get(".doctor-sidebar").classes()).toContain("is-open");
    expect(sidebar.attributes("inert")).toBeUndefined();
    expect(document.activeElement).toBe(firstLink.element);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    await nextTick();
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(sidebar.attributes("inert")).toBeDefined();
    expect(document.activeElement).toBe(menuButton.element);
  });

  it("keeps the doctor sidebar interactive at desktop widths", async () => {
    window.innerWidth = 1280;
    const dashboard = await mountDashboard();
    const sidebar = dashboard.get(".doctor-sidebar");

    expect(sidebar.attributes("inert")).toBeUndefined();
    expect(sidebar.classes()).not.toContain("is-open");
    expect(
      dashboard.get(".doctor-navigation .doctor-nav-link").isVisible(),
    ).toBe(true);
  });

  it("keeps the doctor route restricted to the doctor role", () => {
    const destination = createDestination("/doctor/dashboard");

    signInAs("doctor");
    expect(runGuard(destination)).toBe(true);

    signInAs("patient");
    expect(runGuard(destination)).toEqual({
      name: ROUTE_NAMES.patientDashboard,
    });

    signInAs("doctor");
    expect(runGuard(createDestination("/admin/dashboard"))).toEqual({
      name: ROUTE_NAMES.doctorDashboard,
    });
    expect(runGuard(createDestination("/patient"))).toEqual({
      name: ROUTE_NAMES.doctorDashboard,
    });
  });

  it("integrates ThemeSwitcher with the shared light and dark theme", async () => {
    const dashboard = await mountDashboard();
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

  it("renders notifications and uses only authenticated session profile data", async () => {
    const dashboard = await mountDashboard();

    await dashboard
      .get('button[aria-label="Open notifications"]')
      .trigger("click");
    expect(dashboard.text()).toContain(
      "No notifications were returned.",
    );

    await dashboard
      .get('button[aria-label="Open doctor profile"]')
      .trigger("click");
    expect(dashboard.text()).toContain("Dana Doctor");
    expect(dashboard.text()).toContain("doctor@example.test");
    expect(dashboard.text()).toContain("Doctor");
    expect(dashboard.text()).not.toContain("General practice");

    useAuthStore().user = null;
    await flushPromises();
    expect(dashboard.text()).toContain("Profile information unavailable.");
  });
});
