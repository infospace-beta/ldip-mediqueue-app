import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import SignupView from "@/views/SignupView.vue";

const { registerPatient } = vi.hoisted(() => ({
  registerPatient: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  authService: { registerPatient },
}));

describe("SignupView", () => {
  beforeEach(() => vi.clearAllMocks());

  async function mountSignup() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/signup", name: "signup", component: SignupView },
        { path: "/login", name: "login", component: { template: "<div />" } },
      ],
    });
    await router.push("/signup");
    return mount(SignupView, { global: { plugins: [router] } });
  }

  it("validates the username, required fields, email, and password confirmation", async () => {
    const wrapper = await mountSignup();

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#signup-username").attributes("aria-invalid")).toBe("true");
    expect(wrapper.get("#signup-name").attributes("aria-invalid")).toBe("true");
    expect(wrapper.get("#signup-email").attributes("aria-invalid")).toBe("true");

    await wrapper.get("#signup-username").setValue("ana.patient");
    await wrapper.get("#signup-name").setValue("Ana Patient");
    await wrapper.get("#signup-email").setValue("not-an-email");
    await wrapper.get("#signup-password").setValue("long-password");
    await wrapper.get("#signup-confirm-password").setValue("different");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#signup-email").attributes("aria-invalid")).toBe("true");
    expect(wrapper.get("#signup-confirm-password").attributes("aria-invalid")).toBe("true");
    expect(registerPatient).not.toHaveBeenCalled();
  });

  it("creates an account through the API and confirms success", async () => {
    registerPatient.mockResolvedValue({ data: "Registration successful" });
    const wrapper = await mountSignup();

    await wrapper.get("#signup-username").setValue("ana.patient");
    await wrapper.get("#signup-name").setValue("Ana Patient");
    await wrapper.get("#signup-email").setValue("ana@example.com");
    await wrapper.get("#signup-password").setValue("long-password");
    await wrapper.get("#signup-confirm-password").setValue("long-password");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(registerPatient).toHaveBeenCalledWith({
      username: "ana.patient",
      fullName: "Ana Patient",
      email: "ana@example.com",
      password: "long-password",
    });
    expect(wrapper.get('[role="status"]').text()).toContain(
      "Your account was created",
    );
    expect(wrapper.get("button[type='submit']").attributes("disabled")).toBeDefined();
  });

  it("surfaces API errors without claiming registration succeeded", async () => {
    registerPatient.mockRejectedValue({ isAxiosError: true, response: { data: { message: "Username already exists." } } });
    const wrapper = await mountSignup();

    await wrapper.get("#signup-username").setValue("ana.patient");
    await wrapper.get("#signup-name").setValue("Ana Patient");
    await wrapper.get("#signup-email").setValue("ana@example.com");
    await wrapper.get("#signup-password").setValue("long-password");
    await wrapper.get("#signup-confirm-password").setValue("long-password");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "Username already exists.",
    );
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });
});
