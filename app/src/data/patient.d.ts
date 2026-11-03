export interface PatientProfile {
  name: string;
  id: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  emergencyContact: string;
}

export interface PatientNotification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  kind: "queue" | "appointment" | "information";
  unread: boolean;
}

export const patient: PatientProfile;
export const notifications: PatientNotification[];
export function unreadCount(): number;
export function resetPatientSession(): void;
