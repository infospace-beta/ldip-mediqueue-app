import { describe, expect, it } from "vitest";
import {
  HospitalManagementServiceUnavailableError,
  hospitalManagementService,
} from "@/services/hospitalManagement.service";

describe("hospital management service boundary", () => {
  it("reports directory integration as unavailable instead of inventing an API", async () => {
    await expect(
      hospitalManagementService.getHospitals(),
    ).rejects.toBeInstanceOf(HospitalManagementServiceUnavailableError);
  });

  it("does not claim registration succeeds before a backend exists", async () => {
    await expect(
      hospitalManagementService.registerHospital({ name: "Local draft" }),
    ).rejects.toBeInstanceOf(HospitalManagementServiceUnavailableError);
  });
});
