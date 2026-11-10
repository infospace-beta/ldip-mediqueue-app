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
  it("organizes every public destination under Explore", () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
    const wrapper = mount(AppFooter, { global: { plugins: [router] } });

    const explore = wrapper.get('nav[aria-label="Explore MediQueue"]');
    expect(explore.classes()).toContain("flex-col");
    const destinations = explore
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
      ]),
    );
    expect(explore.text()).toContain("Home");
    expect(explore.text()).toContain("How It Works");
    expect(explore.text()).toContain("FAQs");
    for (const link of explore.findAll("a")) {
      expect(link.classes()).toContain("flex");
      expect(link.classes()).toContain("w-full");
      expect(link.classes()).toContain("min-h-11");
      expect(link.classes()).toContain("focus-visible:outline-2");
    }
  });

  it("preserves patient-service destinations and footer information", () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
    const wrapper = mount(AppFooter, { global: { plugins: [router] } });

    const patientServices = wrapper.get('nav[aria-label="Patient services"]');
    expect(patientServices.classes()).toContain("flex-col");
    for (const link of patientServices.findAll("a")) {
      expect(link.classes()).toContain("flex");
      expect(link.classes()).toContain("w-full");
      expect(link.classes()).toContain("min-h-11");
      expect(link.classes()).toContain("focus-visible:outline-2");
    }
    const destinations = patientServices
      .findAll("a")
      .map((link) => link.attributes("href"));

    expect(destinations).toEqual([
      "/patient/dashboard",
      "/patient/join-queue",
      "/patient/appointments",
      "/patient/emergency",
    ]);
    expect(wrapper.text()).toContain("healthcare queue and visit-management");
    expect(wrapper.text()).toContain("does not replace emergency services");
    expect(wrapper.text()).toContain(`© ${new Date().getFullYear()} MediQueue`);
  });
});
