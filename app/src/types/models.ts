/**
 * The shapes the API deals in.
 *
 * This template keeps them in one place rather than per-feature because the
 * structure is layered, not feature-sliced - services, stores and components
 * all import from here.
 */

export type UserRole = "patient" | "responder" | "doctor" | "staff" | "admin";

/** Roles used by the Spring Boot backend API. */
export type BackendUserRole =
  | "PATIENT"
  | "RESPONDER"
  | "DOCTOR"
  | "RECEPTIONIST"
  | "MEDICAL_STAFF"
  | "HOSPITAL_ADMIN"
  | "SYSTEM_ADMIN";

export const USER_ROLES: readonly UserRole[] = [
  "patient",
  "responder",
  "doctor",
  "staff",
  "admin",
];

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && USER_ROLES.includes(value as UserRole);

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email?: string;
  backendRole?: string;
  hospitalId?: number | null;
  /** Only ever present on the mock records, never on an API response. */
  password?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export type HospitalStatus = "active" | "inactive" | "pending";

export interface HospitalLocation {
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface Hospital {
  id: string;
  name: string;
  hospitalType?: "PUBLIC" | "PRIVATE" | "FAITH_BASED";
  registrationIdentifier?: string;
  phone?: string;
  email?: string;
  location?: HospitalLocation;
  status: HospitalStatus;
}

export interface HospitalRegistrationInput {
  name: string;
  registrationNumber?: string;
  hospitalType: "PUBLIC" | "PRIVATE" | "FAITH_BASED";
  address?: string;
  county?: string;
  town?: string;
  phone?: string;
  email?: string;
  status: "ACTIVE" | "INACTIVE";
}

export type HospitalAssignmentStatus =
  | "active"
  | "pending"
  | "suspended"
  | "revoked";

export interface StaffHospitalAssignment {
  id: string;
  staffUserId: User["id"];
  hospitalId: Hospital["id"];
  hospital: Hospital;
  assignedRole?: string;
  permissions?: string[];
  status: HospitalAssignmentStatus;
}

export interface HospitalWorkspaceState {
  staffUserId: User["id"] | null;
  assignments: StaffHospitalAssignment[];
  selectedHospitalId: Hospital["id"] | null;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags?: string[];
}

export interface Job {
  id: number;
  title: string;
  details: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface ContactReceipt extends ContactMessage {
  id: number;
}

/** What an API error body looks like once axios has parsed it. */
export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}


export interface AdminContactMessage extends ContactMessage {
  id: number;
  status: "NEW" | "READ" | "RESOLVED";
  createdAt: string;
}
