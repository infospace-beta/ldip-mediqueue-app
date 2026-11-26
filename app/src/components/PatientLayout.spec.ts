import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import {
  createMemoryHistory,
  createRouter,
  RouterView,
} from "vue-router";
import PatientLayout from "@/components/PatientLayout.vue";
import { useAuthStore } from "@/stores/auth.store";

describe("PatientLayout mobile navigation", () => {
  const wrappers: VueWrapper[] = [];

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
  });

  async function mountLayout() {
    localStorage.clear();
    const pinia = createPinia();
    setActivePinia(pinia);
    useAuthStore().user = {
      id: 7,
      username: "test-patient",
      firstName: "Test",
      lastName: "Patient",
      role: "patient",
    };
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/patient",
          component: PatientLayout,
          children: [
            { path: "dashboard", component: { template: "<div>Dashboard</div>" } },
            { path: "queue", component: { template: "<div>Queue</div>" } },
          ],
        },
      ],
    });
    await router.push("/patient/dashboard");
    await router.isReady();
    const wrapper = mount(RouterView, {
      attachTo: document.body,
      global: { plugins: [pinia, router] },
    });
    wrappers.push(wrapper);
    await flushPromises();
    return wrapper;
  }

  it("moves focus into the drawer, traps Tab, closes with Escape, and restores focus", async () => {
    const wrapper = await mountLayout();
    const menuButton = wrapper.get(".mobile-menu-trigger");

    expect(menuButton.attributes("aria-controls")).toBe("patient-sidebar");
    expect(menuButton.attributes("aria-expanded")).toBe("false");
    await menuButton.trigger("click");
    await flushPromises();

    expect(menuButton.attributes("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(wrapper.get(".sidebar-close").element);

    const sidebar = wrapper.get(".sidebar");
    const firstFocusable = wrapper.get(".sidebar .brand");
    const lastFocusable = wrapper.get(".sidebar .logout-link");
    if (!(lastFocusable.element instanceof HTMLButtonElement)) {
      throw new Error("Expected the last navigation action to be a button.");
    }
    lastFocusable.element.focus();
    await sidebar.trigger("keydown", { key: "Tab" });
    expect(document.activeElement).toBe(firstFocusable.element);

    await sidebar.trigger("keydown", { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(lastFocusable.element);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();

    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(menuButton.element);
  });

  it("closes on navigation and returns focus to the menu trigger", async () => {
    const wrapper = await mountLayout();
    const menuButton = wrapper.get(".mobile-menu-trigger");
    await menuButton.trigger("click");
    await flushPromises();

    await wrapper.get('.sidebar a[href="/patient/queue"]').trigger("click");
    await flushPromises();

    expect(menuButton.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(menuButton.element);
  });
});
