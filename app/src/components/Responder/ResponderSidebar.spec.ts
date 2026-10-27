import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { describe, expect, it } from "vitest";
import { useAuthStore } from "../../stores/auth.store";
import ResponderSidebar from "./ResponderSidebar.vue";

describe("ResponderSidebar", () => {
  it("clears the existing session and returns to the public landing page on logout", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<main>Public landing</main>" } },
        { path: "/responder/dashboard", component: { template: "<main>Dashboard</main>" } },
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
    };
    auth.token = "test-token";

    await wrapper.get(".responder-logout").trigger("click");
    await flushPromises();

    expect(auth.user).toBeNull();
    expect(auth.token).toBeNull();
    expect(router.currentRoute.value.path).toBe("/");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
