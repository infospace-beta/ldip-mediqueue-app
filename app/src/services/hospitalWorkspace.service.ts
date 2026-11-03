import type { StaffHospitalAssignment, User } from "@/types/models";

export class HospitalWorkspaceServiceUnavailableError extends Error {
  constructor() {
    super("Hospital assignment service is not connected.");
    this.name = "HospitalWorkspaceServiceUnavailableError";
  }
}

export const hospitalWorkspaceService = {
  /**
   * Replace this boundary when the backend publishes its assignment contract.
   * Backend requests must independently verify staff membership and permissions.
   */
  async getAssignmentsForStaff(
    _staffUserId: User["id"],
  ): Promise<StaffHospitalAssignment[]> {
    throw new HospitalWorkspaceServiceUnavailableError();
  },
};
