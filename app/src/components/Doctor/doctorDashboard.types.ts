export type AppointmentStatus =
  "Waiting" | "In consultation" | "Scheduled" | "Completed";

export type PatientStatus = "Active" | "Follow-up";

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  visitType: string;
  status: AppointmentStatus;
  queueTicketId?: number;
  departmentId?: number;
}

export interface DoctorPatient {
  id: string;
  name: string;
  age?: number;
  lastVisit: string;
  visitType: string;
  status: PatientStatus;
  queueTicketId?: number;
}

export const appointmentStatuses = [
  "All",
  "Waiting",
  "In consultation",
  "Scheduled",
  "Completed",
] as const;

export const patientStatuses = ["All", "Active", "Follow-up"] as const;

export function filterAppointments(
  appointments: readonly DoctorAppointment[],
  query: string,
  status: (typeof appointmentStatuses)[number],
): DoctorAppointment[] {
  const search = query.trim().toLowerCase();
  return appointments.filter((appointment) => {
    const matchesStatus = status === "All" || appointment.status === status;
    const matchesSearch =
      !search ||
      [
        appointment.id,
        appointment.patientId,
        appointment.patientName,
        appointment.time,
        appointment.visitType,
        appointment.status,
        String(appointment.queueTicketId ?? ""),
      ].some((value) => value.toLowerCase().includes(search));
    return matchesStatus && matchesSearch;
  });
}

export function filterPatients(
  patients: readonly DoctorPatient[],
  query: string,
  status: (typeof patientStatuses)[number],
): DoctorPatient[] {
  const search = query.trim().toLowerCase();
  return patients.filter((patient) => {
    const matchesStatus = status === "All" || patient.status === status;
    const matchesSearch =
      !search ||
      [
        patient.id,
        patient.name,
        patient.visitType,
        patient.status,
        String(patient.age),
        String(patient.queueTicketId ?? ""),
      ].some((value) => value.toLowerCase().includes(search));
    return matchesStatus && matchesSearch;
  });
}
