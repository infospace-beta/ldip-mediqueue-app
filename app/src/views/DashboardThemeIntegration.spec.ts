import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import TopNavbar from "@/components/TopNavbar.vue";
import ResponderTopbar from "@/components/Responder/ResponderTopbar.vue";
import StaffDashboard from "@/views/StaffDashboard.vue";

describe("shared dashboard theme integration", () => {
  const wrappers: VueWrapper[] = [];

  beforeEach(() => {
    localStorage.clear();
    useTheme().setTheme("system");
    setActivePinia(createPinia());
    window.innerWidth = 390;
  });

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  });

  async function mountPatientDashboard() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/patient/dashboard", component: { template: "<div />" } },
      ],
    });
    await router.push("/patient/dashboard");
    await router.isReady();
    const wrapper = mount(TopNavbar, {
      props: { title: "Dashboard", menuOpen: false },
      global: { plugins: [pinia, router] },
    });
    wrappers.push(wrapper);
    await flushPromises();
    return wrapper;
  }

  async function mountResponderDashboard() {
    const wrapper = mount(ResponderTopbar, {
      props: {
        title: "Responder Dashboard",
        searchable: true,
        mobileNavigationOpen: false,
      },
    });
    wrappers.push(wrapper);
    await flushPromises();
    return wrapper;
  }

  async function mountStaffDashboard() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: "landing",
          component: { template: "<div />" },
        },
      ],
    });
    await router.push("/");
    await router.isReady();
    const wrapper = mount(StaffDashboard, {
      attachTo: document.body,
      global: { plugins: [router] },
    });
    wrappers.push(wrapper);
    await flushPromises();
    return wrapper;
  }

  async function verifySharedTheme(wrapper: VueWrapper) {
    const theme = useTheme();
    const darkButton = wrapper.get('button[aria-label="Dark theme"]');
    await darkButton.trigger("click");

    expect(theme.preference.value).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(darkButton.attributes("aria-pressed")).toBe("true");

    await wrapper.get('button[aria-label="System theme"]').trigger("click");
    expect(theme.preference.value).toBe("system");
    expect(localStorage.getItem("mediqueue-theme")).toBe("system");
  }

  it("integrates the shared theme and accessible mobile navigation in Patient", async () => {
    const topbar = await mountPatientDashboard();
    await verifySharedTheme(topbar);

    const menuButton = topbar.get(".mobile-menu-trigger");
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    await menuButton.trigger("click");
    expect(topbar.emitted("toggle-menu")).toHaveLength(1);
    await topbar.setProps({ menuOpen: true });
    expect(menuButton.attributes("aria-expanded")).toBe("true");
    expect(menuButton.attributes("aria-label")).toBe("Close navigation");
  });

  it("integrates the shared theme and accessible mobile navigation in Responder", async () => {
    const topbar = await mountResponderDashboard();
    await verifySharedTheme(topbar);

    const menuButton = topbar.get(".responder-menu-button");
    expect(menuButton.attributes("aria-controls")).toBe("responder-navigation");
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    await menuButton.trigger("click");
    expect(topbar.emitted("toggle-menu")).toHaveLength(1);
    await topbar.setProps({ mobileNavigationOpen: true });
    expect(menuButton.attributes("aria-expanded")).toBe("true");
    expect(menuButton.attributes("aria-label")).toBe("Close navigation");
    await topbar.setProps({ mobileNavigationOpen: false });
    expect(menuButton.attributes("aria-expanded")).toBe("false");
  });

  it("integrates the shared theme and Escape dismissal in Staff", async () => {
    const dashboard = await mountStaffDashboard();
    expect(dashboard.get(".staff-brand-mark img").attributes("src")).toBe(
      "/mediqueue-logo.png",
    );
    await verifySharedTheme(dashboard);

    const menuButton = dashboard.get(".staff-menu-button");
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    await menuButton.trigger("click");
    expect(menuButton.attributes("aria-expanded")).toBe("true");
    expect(dashboard.get(".staff-sidebar").classes()).toContain(
      "staff-sidebar-open",
    );
    expect(dashboard.get(".staff-sidebar").attributes("inert")).toBeUndefined();
    expect(document.activeElement).toBe(
      dashboard.get(".staff-navigation .staff-nav-link").element,
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(dashboard.get(".staff-sidebar").attributes("inert")).toBeDefined();
    expect(dashboard.get(".staff-sidebar").classes()).not.toContain(
      "staff-sidebar-open",
    );
    expect(document.activeElement).toBe(menuButton.element);
  });

  it("keeps the Responder drawer inert until opened, then closes and restores focus", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/responder/dashboard", component: { template: "<div />" } },
      ],
    });
    await router.push("/responder/dashboard");
    await router.isReady();
    const dashboard = mount(
      (await import("@/views/ResponderDashboard.vue")).default,
      { attachTo: document.body, global: { plugins: [pinia, router] } },
    );
    wrappers.push(dashboard);
    await flushPromises();

    const sidebar = dashboard.get(".responder-sidebar");
    const menuButton = dashboard.get(".responder-menu-button");
    const firstLink = dashboard.get(".responder-nav-link");
    expect(sidebar.attributes("inert")).toBeDefined();

    await menuButton.trigger("click");
    await flushPromises();
    expect(menuButton.attributes("aria-expanded")).toBe("true");
    expect(sidebar.attributes("inert")).toBeUndefined();
    expect(document.activeElement).toBe(firstLink.element);

    await firstLink.trigger("click");
    await flushPromises();
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(sidebar.attributes("inert")).toBeDefined();
    expect(document.activeElement).toBe(menuButton.element);
  });

  it("keeps the Staff desktop sidebar interactive without hiding it", async () => {
    window.innerWidth = 1280;
    const dashboard = await mountStaffDashboard();

    expect(dashboard.get(".staff-sidebar").attributes("inert")).toBeUndefined();
    expect(dashboard.get(".staff-sidebar").classes()).not.toContain(
      "staff-sidebar-open",
    );
    expect(dashboard.get(".staff-navigation .staff-nav-link").isVisible()).toBe(
      true,
    );
  });
});
