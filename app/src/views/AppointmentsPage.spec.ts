import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import AppointmentsPage from "@/views/AppointmentsPage.vue";
import { resetPatientSession } from "@/data/patient";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

vi.mock("@/services/mediqueue.service", () => ({
  mediqueueService: {
    getPatientAppointments: vi.fn(),
    getHospitals: vi.fn(),
    getDepartments: vi.fn(),
    getDoctors: vi.fn(),
    bookAppointment: vi.fn(),
    cancelAppointment: vi.fn(),
  },
}));

describe("AppointmentsPage", () => {
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
    vi.mocked(mediqueueService.getPatientAppointments).mockResolvedValue([]);
    vi.mocked(mediqueueService.getHospitals).mockResolvedValue([]);
  });

  async function mountPage() {
    const wrapper = mount(AppointmentsPage);
    await flushPromises();
    return wrapper;
  }

  it("keeps appointment labels associated with controls and displays an empty directory", async () => {
    const wrapper = await mountPage();
    const fields = [
      ["appointment-hospital", "select"],
      ["appointment-department", "select"],
      ["appointment-doctor", "select"],
      ["appointment-starts-at", "input"],
      ["appointment-reason", "textarea"],
    ];

    for (const [id, selector] of fields) {
      expect(wrapper.get(`label[for="${id}"]`).element.contains(
        wrapper.get(`${selector}#${id}`).element,
      )).toBe(true);
    }

    expect(wrapper.get("form.appointment-booking-form").classes()).toContain(
      "patient-form-grid",
    );
    expect(wrapper.get(".directory-empty").text()).toContain(
      "No active hospitals are currently available",
    );
    expect(wrapper.get('button[type="submit"]').element).toHaveProperty(
      "disabled",
      true,
    );
    expect(mediqueueService.bookAppointment).not.toHaveBeenCalled();
  });

  it("shows a directory error and retries only after an explicit click", async () => {
    vi.mocked(mediqueueService.getHospitals)
      .mockRejectedValueOnce(new Error("Directory unavailable"))
      .mockResolvedValueOnce([]);

    const wrapper = await mountPage();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "Directory unavailable",
    );
    expect(wrapper.find(".directory-empty").exists()).toBe(false);
    expect(mediqueueService.getHospitals).toHaveBeenCalledTimes(1);

    await wrapper.get('[role="alert"] button').trigger("click");
    await flushPromises();

    expect(mediqueueService.getHospitals).toHaveBeenCalledTimes(2);
    expect(wrapper.get(".directory-empty").text()).toContain(
      "No active hospitals are currently available",
    );
    expect(mediqueueService.bookAppointment).not.toHaveBeenCalled();
  });
});
