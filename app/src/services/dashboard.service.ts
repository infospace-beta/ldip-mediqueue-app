import api from "@/services/http/client";

export interface StaffDashboardSummary {
  hospitalId: number | null;
  waitingTickets: number;
  openEmergencyCases: number;
  onDutyDoctors: number;
}

export const dashboardService = {
  getStaffSummary: async (): Promise<StaffDashboardSummary> => {
    const response = await api.get<StaffDashboardSummary>(
      "/api/v1/dashboards/staff",
    );

    return response.data;
  },
};
