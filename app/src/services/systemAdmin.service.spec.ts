import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/services/http/client";
import { systemAdminService } from "@/services/systemAdmin.service";

vi.mock("@/services/http/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("systemAdminService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the verified hospital directory endpoint and query parameters", async () => {
    const page = {
      content: [],
      page: 1,
      size: 10,
      totalElements: 11,
      totalPages: 2,
      last: true,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: page } as never);

    await expect(
      systemAdminService.getHospitals(1, 10, "Central"),
    ).resolves.toEqual(page);
    expect(api.get).toHaveBeenCalledWith("/api/hospitals", {
      params: { page: 1, size: 10, search: "Central" },
    });
  });

  it("creates hospitals using the backend request contract", async () => {
    const request = {
      name: "Central Hospital",
      hospitalType: "PUBLIC" as const,
      status: "ACTIVE" as const,
    };
    const response = { id: 21, ...request };
    vi.mocked(api.post).mockResolvedValueOnce({ data: response } as never);

    await expect(systemAdminService.createHospital(request)).resolves.toEqual(
      response,
    );
    expect(api.post).toHaveBeenCalledWith("/api/hospitals", request);
  });

  it("loads and updates users through the System Admin-protected API", async () => {
    const page = {
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
    };
    const request = {
      username: "admin",
      email: "admin@example.test",
      fullName: "System Admin",
      role: "SYSTEM_ADMIN" as const,
      enabled: true,
      hospitalId: null,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: page } as never);
    vi.mocked(api.put).mockResolvedValueOnce({
      data: { id: 8, ...request },
    } as never);

    await expect(systemAdminService.getUsers(0, 10)).resolves.toEqual(page);
    await expect(
      systemAdminService.updateUser(8, request),
    ).resolves.toMatchObject({
      id: 8,
      role: "SYSTEM_ADMIN",
    });
    expect(api.get).toHaveBeenCalledWith("/api/v1/users", {
      params: { page: 0, size: 10 },
    });
    expect(api.put).toHaveBeenCalledWith("/api/v1/users/8", request);
  });

  it("creates users through the backend user endpoint", async () => {
    const request = {
      username: "new-user",
      email: "new@example.test",
      fullName: "New User",
      role: "PATIENT" as const,
      enabled: true,
      hospitalId: null,
      password: "a-secure-password",
    };
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { id: 10, ...request },
    } as never);

    await systemAdminService.createUser(request);

    expect(api.post).toHaveBeenCalledWith("/api/v1/users", request);
  });

  it("returns only the overall status from the public health endpoint", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { status: "UP", components: { database: { status: "UP" } } },
    } as never);

    await expect(systemAdminService.getSystemHealth()).resolves.toEqual({
      status: "UP",
    });
    expect(api.get).toHaveBeenCalledWith("/actuator/health");
  });

  it("rejects malformed health responses", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: {} } as never);

    await expect(systemAdminService.getSystemHealth()).rejects.toThrow(
      "health endpoint returned an invalid response",
    );
  });
});
