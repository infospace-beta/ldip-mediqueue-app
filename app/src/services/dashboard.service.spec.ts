import { beforeEach, describe, expect, it, vi } from "vitest";

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}));

vi.mock("@/services/http/client", () => ({
  default: {
    get: getMock,
  },
}));

import { dashboardService } from "@/services/dashboard.service";

describe("dashboard service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests the authenticated staff dashboard endpoint", async () => {
    const summary = {
      hospitalId: 2,
      waitingTickets: 12,
      openEmergencyCases: 3,
      onDutyDoctors: 5,
    };

    getMock.mockResolvedValue({ data: summary });

    const result = await dashboardService.getStaffSummary();

    expect(getMock).toHaveBeenCalledWith("/api/v1/dashboards/staff");
    expect(result).toEqual(summary);
  });

  it("propagates backend errors", async () => {
    const error = new Error("Dashboard unavailable");
    getMock.mockRejectedValue(error);

    await expect(dashboardService.getStaffSummary()).rejects.toThrow(
      "Dashboard unavailable",
    );
  });
});
