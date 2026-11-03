import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import LandingView from "@/views/LandingView.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const createRouterForPage = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: ROUTE_NAMES.landing, component: LandingView },
      ...[
        ["/signup", ROUTE_NAMES.signup],
        ["/login", ROUTE_NAMES.login],
        ["/how-it-works", ROUTE_NAMES.howItWorks],
        ["/features", ROUTE_NAMES.features],
        ["/about", ROUTE_NAMES.about],
      ].map(([path, name]) => ({
        path: path as string,
        name: name as string,
        component: { template: "<div />" },
      })),
      { path: "/patient/emergency", component: { template: "<div />" } },
    ],
  });

describe("LandingView", () => {
  it("introduces MediQueue and clearly describes unavailable services", async () => {
    const router = createRouterForPage();
    await router.push("/");
    const wrapper = mount(LandingView, { global: { plugins: [router] } });

    expect(wrapper.get("h1").text()).toContain("A clearer path to care");
    expect(wrapper.text()).toContain(
      "Online account creation and live hospital information are not connected yet.",
    );
    expect(wrapper.text()).toContain(
      "MediQueue does not dispatch emergency services.",
    );
    expect(wrapper.get("img").attributes("src")).toContain("home-care");
  });

  it("retains the page sections and live public destinations", async () => {
    const router = createRouterForPage();
    await router.push("/");
    const wrapper = mount(LandingView, { global: { plugins: [router] } });

    for (const href of [
      "/signup",
      "/login",
      "/how-it-works",
      "/features",
      "/about",
      "/patient/emergency",
    ]) {
      expect(wrapper.find(`a[href="${href}"]`).exists()).toBe(true);
    }

    expect(wrapper.find("#how-it-works").exists()).toBe(true);
    expect(wrapper.find("#services").exists()).toBe(true);
    expect(wrapper.find("#for-care-teams").exists()).toBe(true);
  });
});
