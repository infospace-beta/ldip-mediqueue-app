import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import {
  createMemoryHistory,
  createRouter,
  type Router,
} from "vue-router";
import type * as PatientData from "../data/patient";
import JoinQueueForm from "@/components/JoinQueueForm.vue";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";

vi.mock("@/services/mediqueue.service", () => ({
  mediqueueService: {
    getHospitals: vi.fn(),
    getDepartments: vi.fn(),
    joinQueue: vi.fn(),
  },
}));

vi.mock("../data/patient", async (importOriginal) => {
  const actual = await importOriginal<typeof PatientData>();
  return {
    ...actual,
    setPatientQueue: vi.fn(),
  };
});

const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/patient/queue",
        component: { template: "<div>Queue status</div>" },
      },
    ],
  });

describe("JoinQueueForm", () => {
  let router: Router = createTestRouter();
  let pinia: Pinia = createPinia();

  beforeEach(async () => {
    vi.clearAllMocks();

    pinia = createPinia();
    setActivePinia(pinia);
    router = createTestRouter();

    vi.mocked(mediqueueService.getHospitals).mockResolvedValue([
      { id: 1, name: "Example Hospital", town: "Nakuru" },
    ]);

    vi.mocked(mediqueueService.getDepartments).mockResolvedValue([
      { id: 10, hospitalId: 1, name: "General Practice", code: "GP" },
    ]);

    vi.mocked(mediqueueService.joinQueue).mockResolvedValue({
      id: 42,
      patientId: 7,
      departmentId: 10,
      departmentName: "General Practice",
      hospitalId: 1,
      hospitalName: "Example Hospital",
      status: "WAITING",
      joinedAt: "2026-11-15T10:00:00",
      position: 1,
    });
  });

  async function mountForm() {
    const wrapper = mount(JoinQueueForm, {
      global: {
        plugins: [pinia, router],
      },
    });

    await flushPromises();
    return wrapper;
  }

  it("shows validation when no department is selected", async () => {
    const wrapper = await mountForm();

    await wrapper.get("form").trigger("submit");

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "Select a hospital and department to join its queue.",
    );
    expect(mediqueueService.joinQueue).not.toHaveBeenCalled();
  });

  it("explains when the hospital directory is successfully empty", async () => {
    vi.mocked(mediqueueService.getHospitals).mockResolvedValueOnce([]);

    const wrapper = await mountForm();

    expect(wrapper.get(".directory-empty").text()).toContain(
      "No active hospitals are currently available",
    );
    expect(wrapper.get("select").element).toHaveProperty("disabled", true);
    expect(wrapper.get(".button-join").element).toHaveProperty(
      "disabled",
      true,
    );
    expect(mediqueueService.joinQueue).not.toHaveBeenCalled();
  });

  it("offers a safe retry when the hospital directory request fails", async () => {
    vi.mocked(mediqueueService.getHospitals)
      .mockRejectedValueOnce(new Error("Directory unavailable"))
      .mockResolvedValueOnce([]);

    const wrapper = await mountForm();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "Directory unavailable",
    );
    await wrapper.get('[role="alert"] button').trigger("click");
    await flushPromises();

    expect(mediqueueService.getHospitals).toHaveBeenCalledTimes(2);
    expect(wrapper.get(".directory-empty").text()).toContain(
      "No active hospitals are currently available",
    );
  });

  it("loads departments and submits a queue request", async () => {
    const wrapper = await mountForm();

    const auth = useAuthStore();
    auth.user = {
      id: 7,
      username: "patient@example.test",
      firstName: "Test",
      lastName: "Patient",
      role: "patient",
    };

    const selects = wrapper.findAll("select");
    const hospitalSelect = selects[0];
    const departmentSelect = selects[1];

    if (!hospitalSelect || !departmentSelect) {
      throw new Error("Expected hospital and department dropdowns.");
    }

    await hospitalSelect.setValue("1");
    await flushPromises();

    expect(mediqueueService.getDepartments).toHaveBeenCalledWith(1);

    await departmentSelect.setValue("10");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(mediqueueService.joinQueue).toHaveBeenCalledWith(10);
    expect(wrapper.get('[role="status"]').text()).toContain(
      "Queue ticket #42 was created successfully.",
    );
  });
});
