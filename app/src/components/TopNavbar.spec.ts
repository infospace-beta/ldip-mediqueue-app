import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import TopNavbar from "@/components/TopNavbar.vue";
import { resetPatientSession } from "@/data/patient";

describe("TopNavbar", () => {
  let wrapper: VueWrapper | undefined;
  let router: ReturnType<typeof createRouter>;

  beforeEach(async () => {
    localStorage.clear();
    resetPatientSession();
    setActivePinia(createPinia());
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/patient/dashboard", component: { template: "<div />" } },
        { path: "/patient/queue", component: { template: "<div />" } },
        { path: "/patient/join-queue", component: { template: "<div />" } },
        {
          path: "/patient/appointments",
          component: { template: "<div />" },
        },
        { path: "/patient/emergency", component: { template: "<div />" } },
        { path: "/patient/history", component: { template: "<div />" } },
        { path: "/patient/notifications", component: { template: "<div />" } },
        { path: "/patient/profile", component: { template: "<div />" } },
        { path: "/patient/settings", component: { template: "<div />" } },
      ],
    });
    await router.push("/patient/dashboard");
    wrapper = mount(TopNavbar, {
      global: { plugins: [createPinia(), router] },
      attachTo: document.body,
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    document.body.innerHTML = "";
  });

  it("navigates only when the patient page search matches a known destination", async () => {
    await wrapper?.get("#patient-page-search").setValue("appointments");
    await wrapper?.get(".search-box").trigger("submit");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/patient/appointments");

    await wrapper?.get("#patient-page-search").setValue("unlisted content");
    await wrapper?.get(".search-box").trigger("submit");
    expect(router.currentRoute.value.path).toBe("/patient/appointments");
    expect(wrapper?.get('[role="status"]').text()).toContain(
      "No patient page matches that search.",
    );
  });

  it("closes popovers on Escape", async () => {
    const profileTrigger = wrapper?.get(".profile-trigger");
    await profileTrigger?.trigger("click");
    expect(wrapper?.find("#patient-profile-popover").exists()).toBe(true);

    await profileTrigger?.trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(wrapper?.find("#patient-profile-popover").exists()).toBe(false);
    expect(document.activeElement).toBe(profileTrigger?.element);
  });
});
