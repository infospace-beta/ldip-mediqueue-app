import api from "@/services/http/client";

type BackendUserRole = string;

export type SystemAdminHospitalType = "PUBLIC" | "PRIVATE" | "FAITH_BASED";
export type SystemAdminHospitalStatus = "ACTIVE" | "INACTIVE";

export interface SystemAdminHospital {
  id: number;
  name: string;
  registrationNumber: string | null;
  hospitalType: SystemAdminHospitalType;
  address: string | null;
  county: string | null;
  town: string | null;
  phone: string | null;
  email: string | null;
  status: SystemAdminHospitalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SystemAdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: BackendUserRole;
  enabled: boolean;
  onDuty: boolean;
  hospitalId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemAdminPage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface SystemAdminUserRequest {
  username: string;
  email: string;
  fullName: string;
  role: BackendUserRole;
  enabled: boolean;
  hospitalId: number | null;
  password?: string;
  onDuty?: boolean;
}

export interface SystemAdminHospitalRequest {
  name: string;
  registrationNumber?: string;
  hospitalType: SystemAdminHospitalType;
  address?: string;
  county?: string;
  town?: string;
  phone?: string;
  email?: string;
  status: SystemAdminHospitalStatus;
}

export interface SystemHealth {
  status: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const systemAdminService = {
  async getHospitals(
    page = 0,
    size = 10,
    search?: string,
  ): Promise<SystemAdminPage<SystemAdminHospital>> {
    const { data } = await api.get<SystemAdminPage<SystemAdminHospital>>(
      "/api/hospitals",
      { params: { page, size, ...(search ? { search } : {}) } },
    );
    return data;
  },

  async createHospital(
    request: SystemAdminHospitalRequest,
  ): Promise<SystemAdminHospital> {
    const { data } = await api.post<SystemAdminHospital>(
      "/api/hospitals",
      request,
    );
    return data;
  },

  async getUsers(
    page = 0,
    size = 10,
    search?: string,
  ): Promise<SystemAdminPage<SystemAdminUser>> {
    const { data } = await api.get<SystemAdminPage<SystemAdminUser>>(
      "/api/v1/users",
      { params: { page, size, ...(search ? { search } : {}) } },
    );
    return data;
  },

  async createUser(request: SystemAdminUserRequest): Promise<SystemAdminUser> {
    const { data } = await api.post<SystemAdminUser>("/api/v1/users", request);
    return data;
  },

  async updateUser(
    id: number,
    request: SystemAdminUserRequest,
  ): Promise<SystemAdminUser> {
    const { data } = await api.put<SystemAdminUser>(
      `/api/v1/users/${id}`,
      request,
    );
    return data;
  },

  async getSystemHealth(): Promise<SystemHealth> {
    const { data } = await api.get<unknown>("/actuator/health");
    if (!isRecord(data) || typeof data.status !== "string") {
      throw new Error("The health endpoint returned an invalid response.");
    }
    return { status: data.status };
  },
};
