import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/types/models";
import { authService } from "@/services/auth.service";
import { hospitalWorkspaceService } from "@/services/hospitalWorkspace.service";
import { useHospitalWorkspaceStore } from "@/stores/hospitalWorkspace.store";
import { AxiosError } from "axios";
import { notifications, patient } from "@/data/patient";
import { emergencyRequests } from "@/components/Responder/data.js";

vi.mock("@/services/auth.service", () => ({
  authService: { login: vi.fn() },
}));

vi.mock("@/services/hospitalWorkspace.service", () => ({
  hospitalWorkspaceService: {
    getAssignmentsForStaff: vi.fn(),
  },
}));

const TEST_USER: User = {
  id: 1,
  username: "test@gmail.com",
  firstName: "Test",
  lastName: "User",
  role: "patient",
};

describe("auth store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("stores the user as an object, not a JSON string", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      data: { user: TEST_USER, token: "fake-jwt-token" },
    } as Awaited<ReturnType<typeof authService.login>>);

    const auth = useAuthStore();
    const ok = await auth.login({ email: "test@gmail.com", password: "test" });

    expect(ok).toBe(true);
    expect(auth.user).toEqual(TEST_USER);
    expect(auth.user?.firstName).toBe("Test");
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.token).toBe("fake-jwt-token");
  });

  it("surfaces the API message and stays logged out on failure", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new AxiosError("Bad request", "400", undefined, null, {
        status: 400,
        data: { message: "Username or password is incorrect" },
      } as never),
    );

    const auth = useAuthStore();
    const ok = await auth.login({ email: "test@gmail.com", password: "nope" });

    expect(ok).toBe(false);
    expect(auth.error).toBe("Username or password is incorrect");
    expect(auth.isLoggedIn).toBe(false);
  });

  it.each([undefined, "unknown"])(
    "rejects a login response with missing or unknown role (%s)",
    async (role) => {
      vi.mocked(authService.login).mockResolvedValue({
        data: {
          user: { ...TEST_USER, role } as unknown as User,
          token: "unexpected-token",
        },
      } as Awaited<ReturnType<typeof authService.login>>);

      const auth = useAuthStore();
      const ok = await auth.login({
        email: "test@gmail.com",
        password: "test",
      });

      expect(ok).toBe(false);
      expect(auth.user).toBeNull();
      expect(auth.token).toBeNull();
      expect(auth.error).toBe("This account has an unsupported role.");
    },
  );

  it("clears the session on logout", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      data: { user: TEST_USER, token: "fake-jwt-token" },
    } as Awaited<ReturnType<typeof authService.login>>);

    const auth = useAuthStore();
    await auth.login({ email: "test@gmail.com", password: "test" });
    auth.logout();

    expect(auth.user).toBeNull();
    expect(auth.token).toBeNull();
    expect(auth.isLoggedIn).toBe(false);
  });

  it("clears patient and responder details held only in browser memory", () => {
    patient.name = "Session Patient";
    notifications.push({
      id: "notification-1",
      title: "Queue update",
      message: "Local update",
      time: "Today",
      kind: "queue",
      unread: true,
    });
    emergencyRequests.value.push({
      id: "request-1",
      patient: "Session Patient",
    });

    useAuthStore().logout();

    expect(patient.name).toBe("");
    expect(notifications).toHaveLength(0);
    expect(emergencyRequests.value).toHaveLength(0);
  });

  it("clears the selected hospital workspace on logout", async () => {
    vi.mocked(
      hospitalWorkspaceService.getAssignmentsForStaff,
    ).mockResolvedValue([
      {
        id: "assignment-1",
        staffUserId: TEST_USER.id,
        hospitalId: "hospital-1",
        hospital: {
          id: "hospital-1",
          name: "Assigned Hospital",
          status: "active",
        },
        status: "active",
      },
    ]);
    const workspace = useHospitalWorkspaceStore();
    await workspace.loadAssignments(TEST_USER.id);
    workspace.selectHospital("hospital-1");

    useAuthStore().logout();

    expect(workspace.assignments).toEqual([]);
    expect(workspace.selectedHospitalId).toBeNull();
    expect(workspace.staffUserId).toBeNull();
    expect(workspace.isLoading).toBe(false);
    expect(workspace.error).toBeNull();
  });
});
