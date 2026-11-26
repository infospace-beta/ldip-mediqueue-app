import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import EmergencyPage from "@/views/EmergencyPage.vue";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

vi.mock("@/services/mediqueue.service", () => ({
  mediqueueService: {
    getHospitals: vi.fn(),
    getPatientEmergencyCases: vi.fn(),
    reportEmergency: vi.fn(),
  },
}));

describe("EmergencyPage", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    useAuthStore().user = {
      id: 7,
      username: "test-patient",
      firstName: "Test",
      lastName: "Patient",
      role: "patient",
    };
    vi.clearAllMocks();
    vi.mocked(mediqueueService.getHospitals).mockResolvedValue([]);
    vi.mocked(mediqueueService.getPatientEmergencyCases).mockResolvedValue([]);
  });

  async function mountPage() {
    const wrapper = mount(EmergencyPage);
    await flushPromises();
    return wrapper;
  }

  it("keeps every emergency label associated with its full-width control", async () => {
    const wrapper = await mountPage();
    const fields = [
      ["emergency-hospital", "select"],
      ["emergency-title", "input"],
      ["emergency-description", "textarea"],
      ["emergency-severity", "select"],
    ];

    for (const [id, selector] of fields) {
      expect(wrapper.get(`label[for="${id}"]`).element.contains(
        wrapper.get(`${selector}#${id}`).element,
      )).toBe(true);
    }

    expect(wrapper.get("form.emergency-report-form").classes()).toContain(
      "patient-form-grid",
    );
    expect(wrapper.get(".directory-empty").text()).toContain(
      "No active hospitals are currently available",
    );
    expect(wrapper.get('button[type="submit"]').element).toHaveProperty(
      "disabled",
      true,
    );
    expect(mediqueueService.reportEmergency).not.toHaveBeenCalled();
  });

  it("shows a directory error and retries only after an explicit click", async () => {
    vi.mocked(mediqueueService.getHospitals)
      .mockRejectedValueOnce(new Error("Directory unavailable"))
      .mockResolvedValueOnce([]);

    const wrapper = await mountPage();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "Unable to load hospital directory",
    );
    expect(wrapper.find(".directory-empty").exists()).toBe(false);
    expect(mediqueueService.getHospitals).toHaveBeenCalledTimes(1);

    await wrapper.get('[role="alert"] button').trigger("click");
    await flushPromises();

    expect(mediqueueService.getHospitals).toHaveBeenCalledTimes(2);
    expect(wrapper.get(".directory-empty").text()).toContain(
      "No active hospitals are currently available",
    );
    expect(mediqueueService.reportEmergency).not.toHaveBeenCalled();
  });
});
