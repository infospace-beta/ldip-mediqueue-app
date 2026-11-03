import { nextTick } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { describe, expect, it } from "vitest";
import { ROUTE_NAMES } from "../../constants/routeNames";
import { useAuthStore } from "../../stores/auth.store";
import ResponderSidebar from "./ResponderSidebar.vue";

describe("ResponderSidebar", () => {
  it("uses inert only when the mobile drawer is closed", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: ROUTE_NAMES.landing,
          component: { template: "<main>Public landing</main>" },
        },
        {
          path: "/responder/dashboard",
          component: { template: "<main>Dashboard</main>" },
        },
      ],
    });
    const pinia = createPinia();
    setActivePinia(pinia);
    await router.push("/responder/dashboard");
    await router.isReady();

    const wrapper = mount(ResponderSidebar, {
      props: { open: false, mobileViewport: true },
      global: { plugins: [pinia, router] },
    });

    expect(wrapper.get(".responder-sidebar").attributes("inert")).toBeDefined();
    await wrapper.setProps({ open: true });
    expect(
      wrapper.get(".responder-sidebar").attributes("inert"),
    ).toBeUndefined();
    await wrapper.setProps({ mobileViewport: false, open: false });
    expect(
      wrapper.get(".responder-sidebar").attributes("inert"),
    ).toBeUndefined();
  });

  it("closes from its backdrop and close control", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: ROUTE_NAMES.landing,
          component: { template: "<main>Public landing</main>" },
        },
        {
          path: "/responder/dashboard",
          component: { template: "<main>Dashboard</main>" },
        },
      ],
    });
    const pinia = createPinia();
    setActivePinia(pinia);
    await router.push("/responder/dashboard");
    await router.isReady();
    const wrapper = mount(ResponderSidebar, {
      props: { open: true, mobileViewport: true },
      global: { plugins: [pinia, router] },
    });

    await wrapper.get(".responder-scrim").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
    await wrapper.get(".responder-sidebar-close").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(2);
  });

  it("clears the existing session and returns to the public landing page on logout", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: ROUTE_NAMES.landing,
          component: { template: "<main>Public landing</main>" },
        },
        {
          path: "/responder/dashboard",
          component: { template: "<main>Dashboard</main>" },
        },
      ],
    });
    const pinia = createPinia();
    setActivePinia(pinia);
    await router.push("/responder/dashboard");
    await router.isReady();

    const wrapper = mount(ResponderSidebar, {
      props: { open: true },
      global: { plugins: [pinia, router] },
    });
    const auth = useAuthStore();
    auth.user = {
      id: 1,
      username: "responder@example.test",
      firstName: "Test",
      lastName: "Responder",
      role: "responder",
    };
    auth.token = "test-token";

    await wrapper.get(".responder-logout").trigger("click");
    expect(auth.user).not.toBeNull();
    expect(document.body.querySelector(".confirmation-dialog")).not.toBeNull();
    document.body
      .querySelector(".confirmation-dialog button:last-child")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    await nextTick();

    expect(auth.user).toBeNull();
    expect(auth.token).toBeNull();
    expect(router.currentRoute.value.path).toBe("/");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
