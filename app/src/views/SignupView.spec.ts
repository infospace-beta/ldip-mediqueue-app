import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import SignupView from "@/views/SignupView.vue";

const { signUpPatient } = vi.hoisted(() => ({
  signUpPatient: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  authService: { signUpPatient },
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

    return mount(SignupView, {
      global: { plugins: [router] },
    });
  }

  async function fillValidForm(wrapper: ReturnType<typeof mount>) {
    await wrapper.get("#signup-username").setValue("ana.patient");
    await wrapper.get("#signup-name").setValue("Ana Patient");
    await wrapper.get("#signup-email").setValue("ana@example.com");
    await wrapper.get("#signup-password").setValue("long-password");
    await wrapper.get("#signup-confirm-password").setValue("long-password");
  }

  it("validates required fields, email, username, and password confirmation", async () => {
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
    expect(signUpPatient).not.toHaveBeenCalled();
  });

  it("registers through Supabase and asks the patient to confirm their email", async () => {
    signUpPatient.mockResolvedValue({
      user: { id: "supabase-user-id" },
      session: null,
    });

    const wrapper = await mountSignup();
    await fillValidForm(wrapper);

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(signUpPatient).toHaveBeenCalledWith({
      username: "ana.patient",
      fullName: "Ana Patient",
      email: "ana@example.com",
      password: "long-password",
    });

    expect(wrapper.get('[role="status"]').text()).toContain(
      "confirmation email",
    );
    expect(wrapper.get('[role="status"]').text()).toContain(
      "Your MediQueue patient profile will be created when you first sign in.",
    );
    expect(wrapper.get("button[type='submit']").attributes("disabled")).toBeDefined();
    expect(wrapper.text()).toContain("I have confirmed my email");
  });

  it("shows Supabase errors without claiming registration succeeded", async () => {
    signUpPatient.mockRejectedValue(
      new Error("Email address is already registered."),
    );

    const wrapper = await mountSignup();
    await fillValidForm(wrapper);

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "Email address is already registered.",
    );
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });
});