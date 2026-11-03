import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import AppFooter from "@/components/common/AppFooter.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

vi.mock("@/components/common/AppLogo.vue", () => ({
  default: { template: "<span>MediQueue</span>" },
}));

const routes = [
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
    path: "/faq",
    name: ROUTE_NAMES.faq,
    component: { template: "<div />" },
  },
  {
    path: "/contact",
    name: ROUTE_NAMES.contact,
    component: { template: "<div />" },
  },
  { path: "/patient/dashboard", component: { template: "<div />" } },
  { path: "/patient/join-queue", component: { template: "<div />" } },
  { path: "/patient/appointments", component: { template: "<div />" } },
  { path: "/patient/emergency", component: { template: "<div />" } },
];

describe("AppFooter", () => {
  it("links to existing public and patient service routes", () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
    const wrapper = mount(AppFooter, { global: { plugins: [router] } });

    const destinations = wrapper
      .findAll("a")
      .map((link) => link.attributes("href"));

    expect(destinations).toEqual(
      expect.arrayContaining([
        "/",
        "/how-it-works",
        "/features",
        "/about",
        "/faq",
        "/contact",
        "/patient/dashboard",
        "/patient/join-queue",
        "/patient/appointments",
        "/patient/emergency",
      ]),
    );
  });
});
