import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import HowItWorksView from "@/views/HowItWorksView.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const createRouterForPage = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/how-it-works",
        name: ROUTE_NAMES.howItWorks,
        component: HowItWorksView,
      },
      {
        path: "/features",
        name: ROUTE_NAMES.features,
        component: { template: "<div />" },
      },
      {
        path: "/faq",
        name: ROUTE_NAMES.faq,
        component: { template: "<div />" },
      },
    ],
  });

describe("HowItWorksView", () => {
  it("presents the intended journey and marks unavailable integrations", async () => {
    const router = createRouterForPage();
    await router.push("/how-it-works");
    const wrapper = mount(HowItWorksView, { global: { plugins: [router] } });

    expect(wrapper.get("h1").text()).toContain("Know where to begin");
    expect(wrapper.findAll("ol li")).toHaveLength(3);
    expect(wrapper.text()).toContain(
      "Provider services, account registration, and live visit details are not connected yet.",
    );
    expect(wrapper.text()).toContain(
      "MediQueue does not provide clinical advice or dispatch emergency services.",
    );
    expect(wrapper.get("img").attributes("src")).toContain("care-journey");
  });

  it("links to the existing Features and FAQ routes", async () => {
    const router = createRouterForPage();
    await router.push("/how-it-works");
    const wrapper = mount(HowItWorksView, { global: { plugins: [router] } });

    expect(wrapper.find('a[href="/features"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/faq"]').exists()).toBe(true);
  });
});
