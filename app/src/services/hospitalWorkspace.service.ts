import { dashboardService } from "@/services/dashboard.service";
import { hospitalManagementService } from "@/services/hospitalManagement.service";
import type { StaffHospitalAssignment, User } from "@/types/models";

export const hospitalWorkspaceService = {
  async getAssignmentsForStaff(
    staffUserId: User["id"],
  ): Promise<StaffHospitalAssignment[]> {
    const dashboard = await dashboardService.getStaffSummary();
    if (dashboard.hospitalId === null) return [];

    const hospitalId = String(dashboard.hospitalId);
    const hospital = await hospitalManagementService.getHospital(
      dashboard.hospitalId,
    );
    return [
      {
        id: `${staffUserId}:${hospitalId}`,
        staffUserId,
        hospitalId,
        hospital,
        assignedRole: "STAFF",
        status: hospital.status === "active" ? "active" : "suspended",
      },
    ];
  },
};
