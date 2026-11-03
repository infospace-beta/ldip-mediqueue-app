import type { Hospital, HospitalRegistrationInput } from "@/types/models";

export class HospitalManagementServiceUnavailableError extends Error {
  constructor() {
    super("Hospital management service is not connected.");
    this.name = "HospitalManagementServiceUnavailableError";
  }
}

export const hospitalManagementService = {
  async getHospitals(): Promise<Hospital[]> {
    throw new HospitalManagementServiceUnavailableError();
  },

  async registerHospital(
    _hospital: HospitalRegistrationInput,
  ): Promise<Hospital> {
    throw new HospitalManagementServiceUnavailableError();
  },
};
