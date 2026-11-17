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
  authService: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  },
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

const BACKEND_LOGIN_RESPONSE = {
  accessToken: "test-access-token",
  tokenType: "Bearer",
  expiresIn: 900,
};

const BACKEND_PROFILE = {
  id: 1,
  username: "test@gmail.com",
  email: "test@gmail.com",
  fullName: "Test User",
  role: "PATIENT",
  hospitalId: null,
};

describe("auth store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("stores the backend user profile and access token", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      data: BACKEND_LOGIN_RESPONSE,
    } as Awaited<ReturnType<typeof authService.login>>);

    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      data: BACKEND_PROFILE,
    } as Awaited<ReturnType<typeof authService.getCurrentUser>>);

    const auth = useAuthStore();
    const ok = await auth.login({ email: "test@gmail.com", password: "test" });

    expect(ok).toBe(true);
    expect(auth.user?.id).toBe(1);
    expect(auth.user?.username).toBe("test@gmail.com");
    expect(auth.user?.firstName).toBe("Test");
    expect(auth.user?.lastName).toBe("User");
    expect(auth.user?.role).toBe("patient");
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.token).toBe("test-access-token");
    expect(authService.getCurrentUser).toHaveBeenCalledOnce();
  });

  it("surfaces the API message and stays logged out on login failure", async () => {
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

  it.each([undefined, "UNKNOWN"])(
    "rejects a backend profile with missing or unknown role (%s)",
    async (role) => {
      vi.mocked(authService.login).mockResolvedValue({
        data: BACKEND_LOGIN_RESPONSE,
      } as Awaited<ReturnType<typeof authService.login>>);

      vi.mocked(authService.getCurrentUser).mockResolvedValue({
        data: {
          ...BACKEND_PROFILE,
          role,
        },
      } as Awaited<ReturnType<typeof authService.getCurrentUser>>);

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
      data: BACKEND_LOGIN_RESPONSE,
    } as Awaited<ReturnType<typeof authService.login>>);

    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      data: BACKEND_PROFILE,
    } as Awaited<ReturnType<typeof authService.getCurrentUser>>);

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
