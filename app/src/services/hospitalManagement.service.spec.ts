import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAdminHospitals, createHospital, getHospital } = vi.hoisted(() => ({
  getAdminHospitals: vi.fn(),
  createHospital: vi.fn(),
  getHospital: vi.fn(),
}));

vi.mock("@/services/mediqueue.service", () => ({
  mediqueueService: {
    getAdminHospitals,
    createHospital,
    getHospital,
  },
}));

import { hospitalManagementService } from "@/services/hospitalManagement.service";

describe("hospital management service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps backend hospital records to the admin view model", async () => {
    getAdminHospitals.mockResolvedValue([
      {
        id: 8,
        name: "Central Hospital",
        registrationNumber: "REG-8",
        hospitalType: "PUBLIC",
        address: "1 Health Road",
        county: "Nairobi",
        town: "Westlands",
        status: "ACTIVE",
      },
    ]);

    await expect(hospitalManagementService.getHospitals()).resolves.toEqual([
      {
        id: "8",
        name: "Central Hospital",
        hospitalType: "PUBLIC",
        registrationIdentifier: "REG-8",
        phone: undefined,
        email: undefined,
        location: {
          address: "1 Health Road",
          city: "Westlands",
          region: "Nairobi",
        },
        status: "active",
      },
    ]);
  });

  it("submits registration fields using the backend contract", async () => {
    const record = {
      id: 4,
      name: "New Hospital",
      hospitalType: "PRIVATE",
      status: "ACTIVE",
    };
    createHospital.mockResolvedValue(record);

    await expect(
      hospitalManagementService.registerHospital({
        name: "New Hospital",
        hospitalType: "PRIVATE",
        status: "ACTIVE",
        town: "Nairobi",
      }),
    ).resolves.toMatchObject({ id: "4", name: "New Hospital" });
    expect(createHospital).toHaveBeenCalledWith({
      name: "New Hospital",
      registrationNumber: undefined,
      hospitalType: "PRIVATE",
      address: undefined,
      county: undefined,
      town: "Nairobi",
      phone: undefined,
      email: undefined,
      status: "ACTIVE",
    });
  });
});
