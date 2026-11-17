import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import ContactView from "@/views/ContactView.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";
import { contactService } from "@/services/contact.service";

vi.mock("@/services/contact.service", () => ({
  contactService: {
    send: vi.fn(),
  },
}));

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

const mountContactPage = async () => {
  const router = createRouterForPage();
  await router.push("/contact");
  await router.isReady();

  return mount(ContactView, {
    global: {
      plugins: [router],
    },
  });
};

const fillValidForm = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get("#contact-name").setValue("Ada Lovelace");
  await wrapper.get("#contact-email").setValue("ada@example.com");
  await wrapper
    .get("#contact-message")
    .setValue("I would like to learn more about MediQueue.");

};

describe("ContactView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("validates required fields without submitting a request", async () => {
    const wrapper = await mountContactPage();

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#contact-name").attributes("aria-invalid")).toBe("true");
    expect(wrapper.get("#contact-email").attributes("aria-invalid")).toBe("true");
    expect(wrapper.get("#contact-message").attributes("aria-invalid")).toBe("true");
    expect(contactService.send).not.toHaveBeenCalled();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it("submits valid form data to the contact API", async () => {
    vi.mocked(contactService.send).mockResolvedValue({
      data: {
        id: 1,
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "I would like to learn more about MediQueue.",
      },
      status: 201,
      statusText: "Created",
      headers: {},
      config: {
        headers: new (await import("axios")).AxiosHeaders(),
      },
    });

    const wrapper = await mountContactPage();
    await fillValidForm(wrapper);

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(contactService.send).toHaveBeenCalledOnce();
    expect(contactService.send).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would like to learn more about MediQueue.",
    });
    expect(wrapper.get('[role="status"]').text()).toContain("submitted successfully");
  });

  it("does not show success when the contact API request fails", async () => {
    vi.mocked(contactService.send).mockRejectedValue(
      new Error("Network unavailable"),
    );

    const wrapper = await mountContactPage();
    await fillValidForm(wrapper);

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(contactService.send).toHaveBeenCalledOnce();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
  });
});
