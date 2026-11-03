import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { hospitalWorkspaceService } from "@/services/hospitalWorkspace.service";
import { useHospitalWorkspaceStore } from "@/stores/hospitalWorkspace.store";
import type { StaffHospitalAssignment } from "@/types/models";

vi.mock("@/services/hospitalWorkspace.service", () => ({
  hospitalWorkspaceService: {
    getAssignmentsForStaff: vi.fn(),
  },
}));

const assignment = (
  id: string,
  hospitalId: string,
  name: string,
  staffUserId = 42,
): StaffHospitalAssignment => ({
  id,
  staffUserId,
  hospitalId,
  hospital: { id: hospitalId, name, status: "active" },
  assignedRole: "staff",
  status: "active",
});

describe("hospital workspace store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("represents a successfully loaded account with no assigned hospitals", async () => {
    vi.mocked(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).mockResolvedValue([]);
    const workspace = useHospitalWorkspaceStore();

    await expect(workspace.loadAssignments(42)).resolves.toBe(true);

    expect(workspace.isLoaded).toBe(true);
    expect(workspace.isLoading).toBe(false);
    expect(workspace.assignments).toEqual([]);
    expect(workspace.availableHospitals).toEqual([]);
    expect(workspace.currentHospital).toBeNull();
    expect(workspace.error).toBeNull();
  });

  it("loads and selects a single active assigned hospital", async () => {
    const hospitalAssignment = assignment(
      "assignment-1",
      "hospital-1",
      "North",
    );
    vi.mocked(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).mockResolvedValue([hospitalAssignment]);
    const workspace = useHospitalWorkspaceStore();

    await workspace.loadAssignments(42);
    expect(workspace.availableHospitals).toEqual([hospitalAssignment.hospital]);

    workspace.selectHospital("hospital-1");

    expect(workspace.selectedHospitalId).toBe("hospital-1");
    expect(workspace.currentHospital).toEqual(hospitalAssignment.hospital);
  });

  it("supports multiple active assignments and excludes inactive memberships", async () => {
    const first = assignment("assignment-1", "hospital-1", "North");
    const second = assignment("assignment-2", "hospital-2", "South");
    const inactive = {
      ...assignment("assignment-3", "hospital-3", "West"),
      status: "suspended" as const,
    };
    vi.mocked(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).mockResolvedValue([first, second, inactive]);
    const workspace = useHospitalWorkspaceStore();

    await workspace.loadAssignments(42);
    workspace.selectHospital("hospital-2");

    expect(workspace.availableHospitals.map((hospital) => hospital.id)).toEqual(
      ["hospital-1", "hospital-2"],
    );
    expect(workspace.currentHospital?.name).toBe("South");
  });

  it("rejects selecting a hospital without an active assignment", async () => {
    vi.mocked(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).mockResolvedValue([assignment("assignment-1", "hospital-1", "North")]);
    const workspace = useHospitalWorkspaceStore();
    await workspace.loadAssignments(42);
    workspace.selectHospital("hospital-1");

    expect(() => workspace.selectHospital("hospital-unassigned")).toThrow(
      "You do not have an active assignment",
    );
    expect(workspace.selectedHospitalId).toBe("hospital-1");
  });

  it("exposes loading while assignments are being retrieved", async () => {
    let resolveAssignments!: (value: StaffHospitalAssignment[]) => void;
    vi.mocked(hospitalWorkspaceService.getAssignmentsForStaff).mockReturnValue(
      new Promise((resolve) => {
        resolveAssignments = resolve;
      }),
    );
    const workspace = useHospitalWorkspaceStore();

    const loading = workspace.loadAssignments(42);
    expect(workspace.isLoading).toBe(true);
    expect(workspace.staffUserId).toBe(42);

    resolveAssignments([]);
    await expect(loading).resolves.toBe(true);
    expect(workspace.isLoading).toBe(false);
    expect(workspace.isLoaded).toBe(true);
  });

  it("exposes service failures without treating them as an empty assignment list", async () => {
    vi.mocked(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).mockRejectedValue(
      new Error("Hospital assignment service is not connected."),
    );
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const workspace = useHospitalWorkspaceStore();

    await expect(workspace.loadAssignments(42)).resolves.toBe(false);

    expect(workspace.isLoading).toBe(false);
    expect(workspace.isLoaded).toBe(false);
    expect(workspace.assignments).toEqual([]);
    expect(workspace.error).toBe(
      "Hospital assignment service is not connected.",
    );
    errorSpy.mockRestore();
  });
});
