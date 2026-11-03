import { describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import ContactView from "@/views/ContactView.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const createRouterForPage = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/contact",
        name: ROUTE_NAMES.contact,
        component: ContactView,
      },
      {
        path: "/faq",
        name: ROUTE_NAMES.faq,
        component: { template: "<div />" },
      },
    ],
  });

describe("ContactView", () => {
  it("validates the required fields without submitting a request", async () => {
    const router = createRouterForPage();
    await router.push("/contact");
    const wrapper = mount(ContactView, { global: { plugins: [router] } });

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#contact-name").attributes("aria-invalid")).toBe(
      "true",
    );
    expect(wrapper.get("#contact-email").attributes("aria-invalid")).toBe(
      "true",
    );
    expect(wrapper.get("#contact-message").attributes("aria-invalid")).toBe(
      "true",
    );
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it("confirms valid form data is not sent while contact delivery is unavailable", async () => {
    const router = createRouterForPage();
    await router.push("/contact");
    const wrapper = mount(ContactView, { global: { plugins: [router] } });
    await wrapper.get("#contact-name").setValue("Ada Lovelace");
    await wrapper.get("#contact-email").setValue("ada@example.com");
    await wrapper
      .get("#contact-message")
      .setValue("I would like to learn more.");

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get('[role="status"]').text()).toContain(
      "message submission is not connected",
    );
    expect(wrapper.get('[role="status"]').text()).toContain("Nothing was sent");
  });
});
