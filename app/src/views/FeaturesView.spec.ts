import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import FeaturesView from "@/views/FeaturesView.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const createRouterForPage = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/features",
        name: ROUTE_NAMES.features,
        component: FeaturesView,
      },
      {
        path: "/contact",
        name: ROUTE_NAMES.contact,
        component: { template: "<div />" },
      },
      {
        path: "/how-it-works",
        name: ROUTE_NAMES.howItWorks,
        component: { template: "<div />" },
      },
    ],
  });

describe("FeaturesView", () => {
  it("presents the feature direction and current frontend availability", async () => {
    const router = createRouterForPage();
    await router.push("/features");
    const wrapper = mount(FeaturesView, { global: { plugins: [router] } });

    expect(wrapper.get("h1").text()).toContain("clearer information");
    expect(wrapper.text()).toContain("Available now · interface layer");
    expect(wrapper.text()).toContain("Live hospital services");
    expect(wrapper.text()).toContain("not connected yet");
    expect(wrapper.text()).toContain("No live queue counts");
  });

  it("uses the existing healthcare image and links to real public routes", async () => {
    const router = createRouterForPage();
    await router.push("/features");
    const wrapper = mount(FeaturesView, { global: { plugins: [router] } });

    expect(wrapper.get("img").attributes("src")).toContain("care-team");
    expect(wrapper.get('a[href="#platform-foundation"]').element).toBeTruthy();
    expect(wrapper.get('a[href="/contact"]').text()).toContain("Contact");
    expect(wrapper.get('a[href="/how-it-works"]').element).toBeTruthy();
  });

  it("keeps the prominent photograph responsive and accessible", async () => {
    const router = createRouterForPage();
    await router.push("/features");
    const wrapper = mount(FeaturesView, { global: { plugins: [router] } });

    expect(wrapper.get(".feature-hero-image").classes()).toContain(
      "feature-hero-image",
    );
    expect(wrapper.get(".feature-hero-photo").classes()).toContain(
      "object-cover",
    );
    expect(wrapper.get(".feature-hero-photo").attributes("alt")).toBe(
      "A healthcare professional ready to support a patient",
    );
  });
});
