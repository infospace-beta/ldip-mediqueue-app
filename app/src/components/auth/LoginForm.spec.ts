import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import LoginForm from "@/components/auth/LoginForm.vue";
import { authService } from "@/services/auth.service";
import type { User } from "@/types/models";

const user: User = {
  id: 1,
  username: "test@gmail.com",
  firstName: "Test",
  lastName: "User",
  role: "patient",
};

const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/login", name: "login", component: LoginForm },
      { path: "/signup", name: "signup", component: { template: "<div />" } },
      { path: "/home", name: "home", component: { template: "<div />" } },
      {
        path: "/patient/dashboard",
        name: "patient-dashboard",
        component: { template: "<div />" },
      },
      {
        path: "/responder/dashboard",
        name: "responder-dashboard",
        component: { template: "<div />" },
      },
      {
        path: "/doctor/dashboard",
        name: "doctor-dashboard",
        component: { template: "<div />" },
      },
      {
        path: "/staff/dashboard",
        name: "staff-dashboard",
        component: { template: "<div />" },
      },
      {
        path: "/admin/dashboard",
        name: "admin-dashboard",
        component: { template: "<div />" },
      },
    ],
  });

describe("LoginForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates required fields and provides a password visibility control", async () => {
    setActivePinia(createPinia());
    const router = createTestRouter();
    await router.push("/login");

    const wrapper = mount(LoginForm, { global: { plugins: [router] } });

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#login-email").attributes("aria-invalid")).toBe("true");
    expect(wrapper.get("#login-password").attributes("aria-invalid")).toBe(
      "true",
    );
    expect(wrapper.get("#login-password").attributes("type")).toBe("password");

    await wrapper.get('button[aria-label="Show password"]').trigger("click");

    expect(wrapper.get("#login-password").attributes("type")).toBe("text");
  });

  it("uses the auth service and honors returnUrl after login", async () => {
    setActivePinia(createPinia());
    vi.spyOn(authService, "login").mockResolvedValue({
      data: { user, token: "demo-token" },
    } as Awaited<ReturnType<typeof authService.login>>);

    const router = createTestRouter();
    await router.push("/login?returnUrl=%2Fpatient%2Fdashboard");
    const wrapper = mount(LoginForm, { global: { plugins: [router] } });

    await wrapper.get("#login-email").setValue("test@gmail.com");
    await wrapper.get("#login-password").setValue("test");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(authService.login).toHaveBeenCalledWith({
      email: "test@gmail.com",
      password: "test",
    });
    expect(router.currentRoute.value.fullPath).toBe("/patient/dashboard");
  });

  it("shows a useful authentication failure message", async () => {
    setActivePinia(createPinia());
    vi.spyOn(authService, "login").mockRejectedValue(
      Object.assign(new Error("Bad request"), {
        isAxiosError: true,
        response: {
          data: { message: "Username or password is incorrect" },
        },
      }),
    );

    const router = createTestRouter();
    await router.push("/login");
    const wrapper = mount(LoginForm, { global: { plugins: [router] } });

    await wrapper.get("#login-email").setValue("test@gmail.com");
    await wrapper.get("#login-password").setValue("wrong");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toBe(
      "Username or password is incorrect",
    );
  });

  it("uses the signed-in role dashboard for an unsafe returnUrl", async () => {
    setActivePinia(createPinia());
    vi.spyOn(authService, "login").mockResolvedValue({
      data: {
        user: { ...user, role: "responder" },
        token: "demo-token",
      },
    } as Awaited<ReturnType<typeof authService.login>>);

    const router = createTestRouter();
    await router.push("/login?returnUrl=https%3A%2F%2Fexample.com%2Fadmin");
    const wrapper = mount(LoginForm, { global: { plugins: [router] } });

    await wrapper.get("#login-email").setValue("responder@example.com");
    await wrapper.get("#login-password").setValue("responder123");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(router.currentRoute.value.path).toBe("/responder/dashboard");
  });
});
