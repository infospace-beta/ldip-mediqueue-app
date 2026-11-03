import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import AppHeader from "@/components/common/AppHeader.vue";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

vi.mock("@/components/common/AppLogo.vue", () => ({
  default: { template: "<span>MediQueue</span>" },
}));

const publicRoutes = [
  { path: "/", name: ROUTE_NAMES.landing, component: { template: "<div />" } },
  {
    path: "/how-it-works",
    name: ROUTE_NAMES.howItWorks,
    component: { template: "<div />" },
  },
  {
    path: "/features",
    name: ROUTE_NAMES.features,
    component: { template: "<div />" },
  },
  {
    path: "/about",
    name: ROUTE_NAMES.about,
    component: { template: "<div />" },
  },
  {
    path: "/contact",
    name: ROUTE_NAMES.contact,
    component: { template: "<div />" },
  },
  { path: "/faq", name: ROUTE_NAMES.faq, component: { template: "<div />" } },
  {
    path: "/login",
    name: ROUTE_NAMES.login,
    component: { template: "<div />" },
  },
  {
    path: "/signup",
    name: ROUTE_NAMES.signup,
    component: { template: "<div />" },
  },
  { path: "/home", name: ROUTE_NAMES.home, component: { template: "<div />" } },
];

const createTestRouter = () =>
  createRouter({ history: createMemoryHistory(), routes: publicRoutes });

describe("AppHeader", () => {
  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("links to each public page and points Get started to signup", async () => {
    setActivePinia(createPinia());
    useAuthStore().logout();
    const router = createTestRouter();
    await router.push("/");
    const wrapper = mount(AppHeader, {
      global: { plugins: [router] },
      attachTo: document.body,
    });

    const links = wrapper
      .findAll('nav[aria-label="Main navigation"] a')
      .map((link) => link.attributes("href"));

    expect(links).toEqual([
      "/",
      "/how-it-works",
      "/features",
      "/about",
      "/contact",
      "/faq",
    ]);
    expect(wrapper.get('a[href="/signup"]').text()).toContain("Get started");
  });

  it("closes the mobile menu after a navigation selection", async () => {
    setActivePinia(createPinia());
    useAuthStore().logout();
    const router = createTestRouter();
    await router.push("/");
    const wrapper = mount(AppHeader, {
      global: { plugins: [router] },
      attachTo: document.body,
    });

    await wrapper
      .get('button[aria-label="Open navigation menu"]')
      .trigger("click");
    expect(
      wrapper
        .get('button[aria-label="Close navigation menu"]')
        .attributes("aria-expanded"),
    ).toBe("true");

    await wrapper
      .get('#public-mobile-navigation a[href="/how-it-works"]')
      .trigger("click");
    await flushPromises();
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(router.currentRoute.value.path).toBe("/how-it-works");
    expect(
      wrapper
        .get('button[aria-label="Open navigation menu"]')
        .attributes("aria-expanded"),
    ).toBe("false");
    expect(document.activeElement).toBe(
      wrapper.get('button[aria-label="Open navigation menu"]').element,
    );
  });

  it("confirms logout before ending the authenticated session", async () => {
    setActivePinia(createPinia());
    const auth = useAuthStore();
    auth.user = {
      id: 8,
      username: "patient@example.test",
      firstName: "Pat",
      lastName: "Patient",
      role: "patient",
    };
    auth.token = "session-token";
    const router = createTestRouter();
    await router.push("/");
    const wrapper = mount(AppHeader, {
      global: { plugins: [router] },
      attachTo: document.body,
    });

    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Log out"))
      ?.trigger("click");

    expect(auth.isLoggedIn).toBe(true);
    expect(document.body.textContent).toContain(
      "Logging out ends this session",
    );

    document.body
      .querySelector(".confirmation-dialog button:last-child")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    expect(auth.isLoggedIn).toBe(false);
    expect(auth.token).toBeNull();
    expect(router.currentRoute.value.path).toBe("/");
  });
});
