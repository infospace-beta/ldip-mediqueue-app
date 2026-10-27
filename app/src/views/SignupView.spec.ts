import { describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import SignupView from "@/views/SignupView.vue";

describe("SignupView", () => {
  it("validates required fields, email, and password confirmation", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/signup", name: "signup", component: SignupView },
        { path: "/login", name: "login", component: { template: "<div />" } },
      ],
    });
    await router.push("/signup");
    const wrapper = mount(SignupView, { global: { plugins: [router] } });

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#signup-name").attributes("aria-invalid")).toBe("true");
    expect(wrapper.get("#signup-email").attributes("aria-invalid")).toBe(
      "true",
    );

    await wrapper.get("#signup-name").setValue("Ana Patient");
    await wrapper.get("#signup-email").setValue("not-an-email");
    await wrapper.get("#signup-password").setValue("long-password");
    await wrapper.get("#signup-confirm-password").setValue("different");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#signup-email").attributes("aria-invalid")).toBe(
      "true",
    );
    expect(
      wrapper.get("#signup-confirm-password").attributes("aria-invalid"),
    ).toBe("true");
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it("clearly reports that valid submission cannot create an account", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/signup", name: "signup", component: SignupView },
        { path: "/login", name: "login", component: { template: "<div />" } },
      ],
    });
    await router.push("/signup");
    const wrapper = mount(SignupView, { global: { plugins: [router] } });

    await wrapper.get("#signup-name").setValue("Ana Patient");
    await wrapper.get("#signup-email").setValue("ana@example.com");
    await wrapper.get("#signup-password").setValue("long-password");
    await wrapper.get("#signup-confirm-password").setValue("long-password");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "No account was created",
    );
    expect(wrapper.text()).toContain(
      "Online registration is not available yet",
    );
  });
});
