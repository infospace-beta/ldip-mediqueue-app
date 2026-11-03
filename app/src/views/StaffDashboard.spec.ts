import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { hospitalWorkspaceService } from "@/services/hospitalWorkspace.service";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/types/models";
import StaffDashboard from "@/views/StaffDashboard.vue";
import { staffNavigation } from "@/components/Staff/staffNavigation";

vi.mock("@/services/hospitalWorkspace.service", () => ({
  hospitalWorkspaceService: {
    getAssignmentsForStaff: vi.fn(),
  },
}));

describe("staff dashboard navigation", () => {
  const wrappers: VueWrapper[] = [];

  beforeEach(() => {
    localStorage.clear();
    window.innerWidth = 390;
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  });

  async function mountDashboard(staffUser?: User) {
    const pinia = createPinia();
    setActivePinia(pinia);
    if (staffUser) useAuthStore().user = staffUser;
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: ROUTE_NAMES.landing,
          component: { template: "<div>Landing</div>" },
        },
        {
          path: "/staff/dashboard",
          name: ROUTE_NAMES.staffDashboard,
          component: StaffDashboard,
        },
      ],
    });
    await router.push("/staff/dashboard");
    await router.isReady();
    const wrapper = mount(StaffDashboard, {
      global: { plugins: [pinia, router] },
    });
    wrappers.push(wrapper);
    await flushPromises();
    return { wrapper, router };
  }

  const staffUser: User = {
    id: 42,
    username: "staff@example.test",
    firstName: "Staff",
    lastName: "Member",
    role: "staff",
  };

  it("provides a real section destination and active state for every item", async () => {
    const { wrapper } = await mountDashboard();

    expect(wrapper.findAll(".staff-navigation .staff-nav-link")).toHaveLength(
      staffNavigation.length,
    );
    staffNavigation.forEach((section) => {
      expect(wrapper.find(`#${section.id}`).exists()).toBe(true);
      expect(
        wrapper.get(`.staff-navigation a[href="#${section.id}"]`).text(),
      ).toContain(section.label);
    });
    expect(wrapper.text()).toContain("Assignment pending");
    expect(wrapper.get(".staff-assignment-card strong").text()).toBe(
      "Assignment pending",
    );

    await wrapper.get('.staff-navigation a[href="#patients"]').trigger("click");
    expect(
      wrapper
        .get('.staff-navigation a[href="#patients"]')
        .attributes("aria-current"),
    ).toBe("location");
  });

  it("closes the mobile drawer after section navigation", async () => {
    const { wrapper } = await mountDashboard();
    const menuButton = wrapper.get(".staff-menu-button");

    await menuButton.trigger("click");
    await flushPromises();
    expect(menuButton.attributes("aria-expanded")).toBe("true");

    await wrapper
      .get('.staff-navigation a[href="#notifications"]')
      .trigger("click");
    await flushPromises();

    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(wrapper.get(".staff-sidebar").attributes("inert")).toBeDefined();
    expect(
      wrapper
        .get('.staff-navigation a[href="#notifications"]')
        .attributes("aria-current"),
    ).toBe("location");
  });

  it("loads assigned hospitals for staff and restricts selection to returned assignments", async () => {
    vi.mocked(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).mockResolvedValue([
      {
        id: "assignment-1",
        staffUserId: staffUser.id,
        hospitalId: "hospital-1",
        hospital: {
          id: "hospital-1",
          name: "Assigned North",
          status: "active",
        },
        status: "active",
      },
      {
        id: "assignment-2",
        staffUserId: staffUser.id,
        hospitalId: "hospital-2",
        hospital: {
          id: "hospital-2",
          name: "Assigned South",
          status: "active",
        },
        status: "active",
      },
    ]);
    const { wrapper } = await mountDashboard(staffUser);

    expect(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).toHaveBeenCalledWith(staffUser.id);
    const selector = wrapper.get<HTMLSelectElement>("#staff-hospital-select");
    expect(selector.findAll("option")).toHaveLength(3);

    await selector.setValue("hospital-2");

    expect(selector.element.value).toBe("hospital-2");
    expect(wrapper.get(".staff-assignment-card strong").text()).toBe(
      "Assigned South",
    );
  });

  it("shows a real unassigned state after an empty assignment response", async () => {
    vi.mocked(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).mockResolvedValue([]);
    const { wrapper } = await mountDashboard(staffUser);

    expect(wrapper.get(".staff-assignment-card strong").text()).toBe(
      "No hospital assignment",
    );
    expect(wrapper.find("#staff-hospital-select").exists()).toBe(false);
  });

  it("clears the authenticated session and returns to the landing route", async () => {
    const { wrapper, router } = await mountDashboard();
    const auth = useAuthStore();
    const staffUser: User = {
      id: 1,
      username: "staff@example.test",
      firstName: "Staff",
      lastName: "Member",
      role: "staff",
    };
    auth.user = staffUser;
    auth.token = "staff-session-token";

    await wrapper.get(".staff-logout").trigger("click");
    expect(auth.user).toEqual(staffUser);
    document.body
      .querySelector(".confirmation-dialog button:last-child")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    expect(auth.user).toBeNull();
    expect(auth.token).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.user)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.token)).toBeNull();
    expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.landing);
  });
});
