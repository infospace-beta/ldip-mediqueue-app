export interface PatientProfile {
  name: string;
  id: string;
  username: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  emergencyContact: string;
}

export interface PatientQueue {
  active: boolean;
  ticketId: number | null;
  hospitalId: number | null;
  departmentId: number | null;
  hospital: string;
  department: string;
  service: string;
  visitType: string;
  queueType: string;
  number: number;
  position: number;
  ahead: number;
  wait: number;
  status: string;
  joinedAt: string;
  progress: number;
}

export interface PatientNotification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  kind: string;
  unread: boolean;
}

export interface PatientAppointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  hospital: string;
  status: string;
  startsAt?: string;
  reason?: string;
}

export interface MedicalHistoryRecord {
  id: number;
  date: string;
  doctor: string;
  department: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
}

export const patient: PatientProfile;
export const queue: PatientQueue;
export const appointments: PatientAppointment[];
export const hospitals: unknown[];
export const notifications: PatientNotification[];
export const activities: unknown[];
export const medicalHistory: MedicalHistoryRecord[];
export const emergencyRequests: unknown[];
export function unreadCount(): number;
export function resetPatientSession(): void;
export function setPatientQueue(
  ticket: {
    id: number;
    hospitalId?: number;
    hospitalName?: string;
    departmentId: number;
    departmentName: string;
    status: string;
    joinedAt: string;
    position?: number | null;
    estimatedWaitMinutes?: number | null;
  },
  hospitalName?: string,
  hospitalId?: number | null,
): PatientQueue;
export function clearPatientQueue(status?: string): PatientQueue;
