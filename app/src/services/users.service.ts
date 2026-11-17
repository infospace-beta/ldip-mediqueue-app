import { mediqueueService, type UserRecord } from "@/services/mediqueue.service";
import type { User, UserRole } from "@/types/models";

function mapRole(role: string): UserRole {
  switch (role.toUpperCase()) {
    case "PATIENT":
      return "patient";
    case "RESPONDER":
      return "responder";
    case "DOCTOR":
      return "doctor";
    case "RECEPTIONIST":
    case "MEDICAL_STAFF":
      return "staff";
    case "HOSPITAL_ADMIN":
    case "SYSTEM_ADMIN":
      return "admin";
    default:
      throw new Error(`Unsupported backend user role: ${role}`);
  }
}

function mapUser(record: UserRecord): User {
  const [firstName = record.username, ...lastName] = record.fullName
    .trim()
    .split(/\s+/);
  return {
    id: record.id,
    username: record.username,
    firstName,
    lastName: lastName.join(" "),
    role: mapRole(record.role),
    email: record.email,
    backendRole: record.role,
    hospitalId: record.hospitalId,
  };
}

export const usersService = {
  async getAll(): Promise<User[]> {
    return (await mediqueueService.getUsers()).map(mapUser);
  },

  async getById(id: string | number): Promise<User> {
    return mapUser(await mediqueueService.getUser(Number(id)));
  },
};
