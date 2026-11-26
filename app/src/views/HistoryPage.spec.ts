import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import HistoryPage from "@/views/HistoryPage.vue";
import { medicalHistory, resetPatientSession } from "@/data/patient";
import { useAuthStore } from "@/stores/auth.store";
import {
  mediqueueService,
  type ClinicalRecord,
} from "@/services/mediqueue.service";

vi.mock("@/services/mediqueue.service", () => ({
  mediqueueService: {
    getPatientClinicalRecords: vi.fn(),
  },
}));

describe("HistoryPage", () => {
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
  });

  function mountPage() {
    return mount(HistoryPage);
  }

  it("shows loading before a successful empty response", async () => {
    let resolveRecords!: (records: ClinicalRecord[]) => void;
    vi.mocked(mediqueueService.getPatientClinicalRecords).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRecords = resolve;
        }),
    );

    const wrapper = mountPage();
    expect(wrapper.get('[role="status"]').text()).toContain(
      "Loading your clinical records",
    );

    resolveRecords([]);
    await flushPromises();

    expect(wrapper.get('[role="status"]').text()).toContain(
      "No medical history available",
    );
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it("shows a distinct 401 error and performs no automatic retry", async () => {
    vi.mocked(mediqueueService.getPatientClinicalRecords)
      .mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 401 },
      })
      .mockResolvedValueOnce([]);

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.get(".history-error").text()).toContain("HTTP 401");
    expect(wrapper.get(".history-error").text()).toContain(
      "not authorized to view clinical records",
    );
    expect(wrapper.get(".history-error").attributes("role")).toBe("alert");
    expect(wrapper.find(".history-error").text()).not.toContain(
      "No medical history available",
    );
    expect(mediqueueService.getPatientClinicalRecords).toHaveBeenCalledTimes(1);

    await wrapper.get(".history-error button").trigger("click");
    await flushPromises();

    expect(mediqueueService.getPatientClinicalRecords).toHaveBeenCalledTimes(2);
    expect(wrapper.get('[role="status"]').text()).toContain(
      "No medical history available",
    );
  });

  it("renders a returned record instead of an empty state", async () => {
    vi.mocked(mediqueueService.getPatientClinicalRecords).mockResolvedValueOnce([
      {
        id: 1,
        queueTicketId: 2,
        patientId: 7,
        authoredById: 3,
        authoredByName: "Test clinician",
        diagnosis: "Test diagnosis",
        treatment: "Test treatment",
        prescription: null,
        recordedAt: "2026-01-15T10:00:00Z",
      },
    ]);

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.get(".history-table").text()).toContain("Test diagnosis");
    expect(wrapper.find(".history-error").exists()).toBe(false);
    expect(wrapper.find(".history-empty").exists()).toBe(false);
    expect(medicalHistory).toHaveLength(1);
  });
});
