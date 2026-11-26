import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import DashboardPage from "@/views/DashboardPage.vue";
import { resetPatientSession } from "@/data/patient";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

vi.mock("@/services/mediqueue.service", () => ({
  mediqueueService: {
    getPatient: vi.fn(),
    getPatientAppointments: vi.fn(),
    getNotifications: vi.fn(),
    getPatientVisits: vi.fn(),
  },
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    localStorage.clear();
    resetPatientSession();
    setActivePinia(createPinia());
    useAuthStore().user = {
      id: 7,
      username: "test-patient",
      firstName: "Test",
      lastName: "Patient",
      role: "patient",
    };
    vi.clearAllMocks();
    vi.mocked(mediqueueService.getPatient).mockResolvedValue({
      id: 7,
      username: "test-patient",
      email: "patient@example.test",
      fullName: "Test Patient",
    });
    vi.mocked(mediqueueService.getPatientAppointments).mockResolvedValue([]);
    vi.mocked(mediqueueService.getNotifications).mockResolvedValue([]);
    vi.mocked(mediqueueService.getPatientVisits).mockResolvedValue([]);
  });

  it("uses the local image and renders an accessible fallback when it fails", async () => {
    const wrapper = mount(DashboardPage);
    await flushPromises();

    const image = wrapper.get(".dashboard-welcome-image");
    expect(image.attributes("alt")).toBe(
      "Healthcare professional ready to help a patient",
    );
    expect(image.attributes("src")).toContain("care-team");
    expect(wrapper.find(".dashboard-welcome-fallback").exists()).toBe(false);

    await image.trigger("error");

    expect(wrapper.find(".dashboard-welcome-image").exists()).toBe(false);
    expect(
      wrapper.get(".dashboard-welcome-fallback").attributes("role"),
    ).toBe("img");
    expect(
      wrapper.get(".dashboard-welcome-fallback").attributes("aria-label"),
    ).toBe("Healthcare professional ready to help a patient");
  });
});
