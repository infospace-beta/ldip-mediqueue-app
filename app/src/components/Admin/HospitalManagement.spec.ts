import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createPinia } from "pinia";
import { hospitalManagementService } from "@/services/hospitalManagement.service";
import HospitalManagement from "@/components/Admin/HospitalManagement.vue";
import { useAuthStore } from "@/stores/auth.store";

vi.mock("@/services/hospitalManagement.service", () => ({
  hospitalManagementService: {
    getHospitals: vi.fn(),
    getHospital: vi.fn(),
    registerHospital: vi.fn(),
  },
}));

describe("Admin hospital management", () => {
  const wrappers: VueWrapper[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  });

  async function mountPanel() {
    const pinia = createPinia();
    useAuthStore(pinia).user = {
      id: 1,
      username: "admin",
      firstName: "System",
      lastName: "Admin",
      role: "admin",
      backendRole: "SYSTEM_ADMIN",
    };
    const wrapper = mount(HospitalManagement, {
      global: { plugins: [pinia] },
    });
    wrappers.push(wrapper);
    return wrapper;
  }

  it("renders returned hospitals and filters the live list", async () => {
    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([
      {
        id: "8",
        name: "Central Hospital",
        registrationIdentifier: "REG-8",
        location: { city: "Nairobi" },
        status: "active",
      },
      {
        id: "9",
        name: "Coast Hospital",
        location: { city: "Mombasa" },
        status: "inactive",
      },
    ]);
    const wrapper = await mountPanel();
    await flushPromises();

    expect(wrapper.findAll(".admin-hospital-list li")).toHaveLength(2);
    await wrapper.get("#hospital-directory-search").setValue("Coast");
    expect(wrapper.findAll(".admin-hospital-list li")).toHaveLength(1);
    expect(wrapper.text()).toContain("Coast Hospital");
    expect(wrapper.text()).not.toContain("Central Hospital");
  });

  it("submits hospital registration using the backend DTO fields", async () => {
    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([]);
    vi.mocked(hospitalManagementService.registerHospital).mockResolvedValue({
      id: "10",
      name: "New Hospital",
      hospitalType: "PUBLIC",
      status: "active",
    });
    const wrapper = await mountPanel();
    await flushPromises();

    await wrapper.get("#hospital-name").setValue("New Hospital");
    await wrapper.get("#hospital-registration-number").setValue("REG-10");
    await wrapper.get("#hospital-town").setValue("Nairobi");
    await wrapper.get(".admin-hospital-form").trigger("submit");
    await flushPromises();

    expect(hospitalManagementService.registerHospital).toHaveBeenCalledWith({
      name: "New Hospital",
      registrationNumber: "REG-10",
      hospitalType: "PUBLIC",
      address: undefined,
      county: undefined,
      town: "Nairobi",
      phone: undefined,
      email: undefined,
      status: "ACTIVE",
    });
    expect(wrapper.text()).toContain("Hospital registered successfully.");
  });
});
