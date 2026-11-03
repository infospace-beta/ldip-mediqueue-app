import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { hospitalManagementService } from "@/services/hospitalManagement.service";
import HospitalManagement from "@/components/Admin/HospitalManagement.vue";
import type { Hospital, HospitalRegistrationInput } from "@/types/models";

vi.mock("@/services/hospitalManagement.service", () => ({
  hospitalManagementService: {
    getHospitals: vi.fn(),
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
    const wrapper = mount(HospitalManagement);
    wrappers.push(wrapper);
    return wrapper;
  }

  it("shows a verified empty-directory state when service returns no hospitals", async () => {
    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([]);
    const wrapper = await mountPanel();
    await flushPromises();

    expect(wrapper.text()).toContain("No hospital records available");
    expect(wrapper.text()).toContain(
      "The connected service returned no hospital records.",
    );
    expect(wrapper.findAll(".admin-hospital-list li")).toHaveLength(0);
    expect(
      wrapper.get("#hospital-directory-search").attributes("disabled"),
    ).toBeDefined();
  });

  it("renders only returned hospital details and filters them through search", async () => {
    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([
      {
        id: "verified-1",
        name: "North Care",
        registrationIdentifier: "REG-verified",
        location: { city: "Nairobi", country: "Kenya" },
        status: "active",
      },
      {
        id: "verified-2",
        name: "South Clinic",
        location: { city: "Mombasa" },
        status: "pending",
      },
    ]);
    const wrapper = await mountPanel();
    await flushPromises();

    expect(wrapper.findAll(".admin-hospital-list li")).toHaveLength(2);
    expect(wrapper.text()).toContain("REG-verified");
    expect(wrapper.text()).toContain("Nairobi, Kenya");
    expect(wrapper.find(".admin-hospital-status.is-active").text()).toBe(
      "active",
    );
    expect(wrapper.find(".admin-hospital-status:not(.is-active)").text()).toBe(
      "pending",
    );

    await wrapper.get("#hospital-directory-search").setValue("South");
    expect(wrapper.findAll(".admin-hospital-list li")).toHaveLength(1);
    expect(wrapper.text()).toContain("South Clinic");
    expect(wrapper.text()).not.toContain("North Care");
  });

  it("keeps the loading state visible while fetching the directory", async () => {
    let resolveHospitals!: (hospitals: Hospital[]) => void;
    vi.mocked(hospitalManagementService.getHospitals).mockReturnValue(
      new Promise((resolve) => {
        resolveHospitals = resolve;
      }),
    );
    const wrapper = await mountPanel();
    await flushPromises();

    expect(wrapper.get('[role="status"]').text()).toContain(
      "Loading hospital directory",
    );

    resolveHospitals([]);
    await flushPromises();
    expect(wrapper.text()).toContain("No hospital records available");
  });

  it("presents directory errors and allows retry", async () => {
    vi.mocked(hospitalManagementService.getHospitals)
      .mockRejectedValueOnce(new Error("Hospital directory is not connected."))
      .mockResolvedValueOnce([]);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const wrapper = await mountPanel();
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "Hospital directory is not connected.",
    );
    await wrapper.get(".admin-hospital-error button").trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("No hospital records available");
    expect(hospitalManagementService.getHospitals).toHaveBeenCalledTimes(2);
    errorSpy.mockRestore();
  });

  it("validates the required hospital name and never submits invalid details", async () => {
    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([]);
    const wrapper = await mountPanel();
    await flushPromises();

    expect(wrapper.get("#hospital-name").attributes("required")).toBeDefined();
    expect(wrapper.find("#hospital-registration-title").text()).toBe(
      "Prepare hospital details",
    );

    await wrapper.get(".admin-hospital-form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#hospital-name").attributes("aria-invalid")).toBe(
      "true",
    );
    expect(wrapper.get("#hospital-name-error").text()).toBe(
      "Enter a hospital name.",
    );
    expect(hospitalManagementService.registerHospital).not.toHaveBeenCalled();

    await wrapper.get("#hospital-name").setValue("   ");
    await wrapper.get(".admin-hospital-form").trigger("submit");
    await flushPromises();

    expect(wrapper.get("#hospital-name-error").text()).toBe(
      "Enter a hospital name.",
    );
    expect(hospitalManagementService.registerHospital).not.toHaveBeenCalled();
  });

  it("prepares normalized valid details but reports registration unavailable", async () => {
    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([]);
    vi.mocked(hospitalManagementService.registerHospital).mockRejectedValue(
      new Error("Hospital management service is not connected."),
    );
    const wrapper = await mountPanel();
    await flushPromises();

    await wrapper.get("#hospital-name").setValue("  Example Medical Centre ");
    await wrapper
      .get("#hospital-registration-identifier")
      .setValue("  REG-123  ");
    await wrapper.get("#hospital-address").setValue("  12 Care Road ");
    await wrapper.get("#hospital-city").setValue("  Nairobi ");
    await wrapper.get(".admin-hospital-form").trigger("submit");
    await flushPromises();

    expect(hospitalManagementService.registerHospital).toHaveBeenCalledWith({
      name: "Example Medical Centre",
      registrationIdentifier: "REG-123",
      location: {
        address: "12 Care Road",
        city: "Nairobi",
        region: "",
        country: "",
      },
    } satisfies HospitalRegistrationInput);
    expect(
      wrapper.get('[role="status"].admin-hospital-registration-message').text(),
    ).toContain("Hospital management service is not connected.");
    expect(wrapper.text()).toContain(
      "Your validated details were not submitted or saved.",
    );
    expect(wrapper.text()).not.toContain("Hospital registered");
  });

  it("uses accessible labels and usable small-screen form layout", async () => {
    vi.mocked(hospitalManagementService.getHospitals).mockResolvedValue([]);
    const wrapper = await mountPanel();
    await flushPromises();

    for (const id of [
      "hospital-name",
      "hospital-registration-identifier",
      "hospital-address",
      "hospital-city",
      "hospital-region",
      "hospital-country",
    ]) {
      expect(wrapper.find(`label[for="${id}"]`).exists()).toBe(true);
    }
    expect(wrapper.get("form").attributes("novalidate")).toBeDefined();
    expect(
      wrapper.get("button[type='submit']").attributes("disabled"),
    ).toBeUndefined();
  });
});
