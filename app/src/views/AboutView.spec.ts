import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import AboutView from "@/views/AboutView.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const createRouterForPage = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/about", name: ROUTE_NAMES.about, component: AboutView },
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
        path: "/contact",
        name: ROUTE_NAMES.contact,
        component: { template: "<div />" },
      },
    ],
  });

describe("AboutView", () => {
  it("explains MediQueue's supported purpose without implying live integrations", async () => {
    const router = createRouterForPage();
    await router.push("/about");
    const wrapper = mount(AboutView, { global: { plugins: [router] } });

    expect(wrapper.get("h1").text()).toContain("Care information");
    expect(wrapper.text()).toContain(
      "Hospital services, operational records, and provider connections are not live yet.",
    );
    expect(wrapper.get("img").attributes("src")).toContain("about-care");
  });

  it("links to existing public pages", async () => {
    const router = createRouterForPage();
    await router.push("/about");
    const wrapper = mount(AboutView, { global: { plugins: [router] } });

    expect(wrapper.find('a[href="/how-it-works"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/features"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/contact"]').exists()).toBe(true);
  });
});
