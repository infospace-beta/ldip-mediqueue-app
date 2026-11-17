
import api from "@/services/http/client";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface HospitalRecord {
  id: number;
  name: string;
  registrationNumber?: string | null;
  hospitalType?: "PUBLIC" | "PRIVATE" | "FAITH_BASED";
  address?: string | null;
  county?: string | null;
  town?: string | null;
  phone?: string | null;
  email?: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export interface HospitalDirectoryEntry {
  id: number;
  name: string;
  county?: string | null;
  town?: string | null;
}

export interface DepartmentRecord {
  id: number;
  hospitalId: number;
  name: string;
  code: string;
  description?: string | null;
  status?: "ACTIVE" | "INACTIVE";
}

export interface DoctorDirectoryEntry {
  id: number;
  fullName: string;
}

export interface PatientRecord {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export interface QueueTicketRecord {
  id: number;
  patientId: number;
  departmentId: number;
  departmentName: string;
  status: "WAITING" | "CALLED" | "SKIPPED" | "COMPLETED" | "CANCELLED";
  joinedAt: string;
  calledAt?: string | null;
  completedAt?: string | null;
  position?: number | null;
  estimatedWaitMinutes?: number | null;
}

export interface AppointmentRecord {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName: string;
  departmentId: number;
  departmentName: string;
  hospitalId: number;
  hospitalName: string;
  startsAt: string;
  reason: string;
  status: string;
}

export interface NotificationRecord {
  id: number;
  kind: string;
  title: string;
  message: string;
  createdAt: string;
  unread: boolean;
}

export interface ClinicalRecord {
  id: number;
  queueTicketId: number;
  patientId: number;
  authoredById: number;
  authoredByName: string;
  diagnosis: string;
  treatment: string;
  prescription?: string | null;
  recordedAt: string;
}

export interface EmergencyRecord {
  id: number;
  hospitalId: number;
  patientId?: number | null;
  reportedById: number;
  assignedResponderId?: number | null;
  title: string;
  description: string;
  severity: string;
  status: string;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  enabled: boolean;
  onDuty: boolean;
  hospitalId?: number | null;
}

export interface UserRequest {
  username: string;
  email: string;
  fullName: string;
  role: string;
  enabled: boolean;
  hospitalId?: number | null;
  password?: string;
  onDuty?: boolean;
}

export interface HospitalRequest {
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

export interface DepartmentRequest {
  hospitalId: number;
  name: string;
  code: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
}

const pageParams = { page: 0, size: 100 };
const pageContent = <T>(page: PageResponse<T>) => page.content;

export const mediqueueService = {
  getHospitals: async () =>
    (await api.get<HospitalDirectoryEntry[]>("/api/v1/directory/hospitals"))
      .data,

  getHospital: async (hospitalId: number) =>
    (await api.get<HospitalRecord>(`/api/hospitals/${hospitalId}`)).data,

  getDepartments: async (hospitalId: number) =>
    (await api.get<DepartmentRecord[]>(
      `/api/v1/directory/hospitals/${hospitalId}/departments`,
    )).data,

  getDoctors: async (hospitalId: number) =>
    (await api.get<DoctorDirectoryEntry[]>(
      `/api/v1/directory/hospitals/${hospitalId}/doctors`,
    )).data,

  getPatient: async (patientId: number) =>
    (await api.get<PatientRecord>(`/api/v1/patients/${patientId}`)).data,

  updatePatient: async (
    patientId: number,
    request: Pick<PatientRecord, "username" | "email" | "fullName">,
  ) =>
    (
      await api.put<PatientRecord>(
        `/api/v1/patients/${patientId}`,
        request,
      )
    ).data,

  getPatientVisits: async (patientId: number, status?: string) =>
    pageContent(
      (
        await api.get<PageResponse<QueueTicketRecord>>(
          `/api/v1/patients/${patientId}/visits`,
          { params: { ...pageParams, ...(status ? { status } : {}) } },
        )
      ).data,
    ),

  getQueueTicket: async (ticketId: number) =>
    (await api.get<QueueTicketRecord>(`/api/v1/queue-tickets/${ticketId}`))
      .data,

  joinQueue: async (departmentId: number) =>
    (
      await api.post<QueueTicketRecord>(
        `/api/v1/departments/${departmentId}/queue-tickets`,
      )
    ).data,

  cancelQueueTicket: async (ticketId: number) =>
    api.delete(`/api/v1/queue-tickets/${ticketId}`),

  getPatientAppointments: async (patientId: number) =>
    pageContent(
      (
        await api.get<PageResponse<AppointmentRecord>>(
          `/api/v1/patients/${patientId}/appointments`,
          { params: pageParams },
        )
      ).data,
    ),

  bookAppointment: async (request: {
    doctorId: number;
    departmentId: number;
    startsAt: string;
    reason: string;
  }) => (await api.post<AppointmentRecord>("/api/v1/appointments", request))
    .data,

  cancelAppointment: async (appointmentId: number) =>
    api.delete(`/api/v1/appointments/${appointmentId}`),

  getNotifications: async () =>
    pageContent(
      (
        await api.get<PageResponse<NotificationRecord>>(
          "/api/v1/notifications",
          { params: pageParams },
        )
      ).data,
    ),

  markNotificationRead: async (notificationId: number) =>
    api.patch(`/api/v1/notifications/${notificationId}/read`),

  markAllNotificationsRead: async () =>
    api.patch("/api/v1/notifications/read-all"),

  getPatientEmergencyCases: async (patientId: number) =>
    pageContent(
      (
        await api.get<PageResponse<EmergencyRecord>>(
          `/api/v1/patients/${patientId}/emergency-cases`,
          { params: pageParams },
        )
      ).data,
    ),

  reportEmergency: async (
    hospitalId: number,
    request: {
      title: string;
      description: string;
      severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      patientId?: number;
    },
  ) =>
    (
      await api.post<EmergencyRecord>(
        `/api/v1/hospitals/${hospitalId}/emergency-cases`,
        request,
      )
    ).data,

  getPatientClinicalRecords: async (patientId: number) =>
    pageContent(
      (
        await api.get<PageResponse<ClinicalRecord>>(
          `/api/v1/patients/${patientId}/clinical-records`,
          { params: pageParams },
        )
      ).data,
    ),

  getStaffSummary: async () =>
    (
      await api.get<{
        hospitalId: number | null;
        waitingTickets: number;
        openEmergencyCases: number;
        onDutyDoctors: number;
      }>("/api/v1/dashboards/staff")
    ).data,

  getDoctorSummary: async () =>
    (
      await api.get<{
        hospitalId: number | null;
        onDuty: boolean;
        waitingTickets: number;
        openEmergencyCases: number;
      }>("/api/v1/dashboards/doctor")
    ).data,

  getResponderSummary: async () =>
    (
      await api.get<{
        hospitalId: number | null;
        assignedCases: number;
        respondingCases: number;
      }>("/api/v1/dashboards/responder")
    ).data,

  getResponderEmergencyCases: async () =>
    pageContent(
      (
        await api.get<PageResponse<EmergencyRecord>>(
          "/api/v1/responders/me/emergency-cases",
          { params: pageParams },
        )
      ).data,
    ),

  getHospitalSummary: async (hospitalId: number) =>
    (
      await api.get<{
        hospitalId: number;
        waitingTickets: number;
        averageWaitMinutes: number | null;
        openEmergencyCases: number;
        onDutyDoctors: number;
      }>(`/api/v1/dashboards/hospitals/${hospitalId}`)
    ).data,

  getAdminHospitals: async () =>
    pageContent(
      (
        await api.get<PageResponse<HospitalRecord>>("/api/hospitals", {
          params: pageParams,
        })
      ).data,
    ),

  createHospital: async (request: HospitalRequest) =>
    (await api.post<HospitalRecord>("/api/hospitals", request)).data,

  updateHospital: async (hospitalId: number, request: HospitalRequest) =>
    (
      await api.put<HospitalRecord>(
        `/api/hospitals/${hospitalId}`,
        request,
      )
    ).data,

  deleteHospital: async (hospitalId: number) =>
    api.delete(`/api/hospitals/${hospitalId}`),

  getHospitalDepartments: async (hospitalId: number) =>
    pageContent(
      (
        await api.get<PageResponse<DepartmentRecord>>(
          `/api/hospitals/${hospitalId}/departments`,
          { params: pageParams },
        )
      ).data,
    ),

  updateDepartment: async (
    hospitalId: number,
    departmentId: number,
    request: DepartmentRequest,
  ) =>
    (
      await api.put<DepartmentRecord>(
        `/api/hospitals/${hospitalId}/departments/${departmentId}`,
        request,
      )
    ).data,

  deleteDepartment: async (hospitalId: number, departmentId: number) =>
    api.delete(
      `/api/hospitals/${hospitalId}/departments/${departmentId}`,
    ),

  createDepartment: async (request: DepartmentRequest) =>
    (
      await api.post<DepartmentRecord>(
        `/api/hospitals/${request.hospitalId}/departments`,
        request,
      )
    ).data,

  getUsers: async (params: {
    role?: string;
    enabled?: boolean;
    hospitalId?: number;
    search?: string;
  } = {}) =>
    pageContent(
      (
        await api.get<PageResponse<UserRecord>>("/api/v1/users", {
          params: { ...pageParams, ...params },
        })
      ).data,
    ),

  createUser: async (request: UserRequest) =>
    (await api.post<UserRecord>("/api/v1/users", request)).data,

  updateUser: async (userId: number, request: UserRequest) =>
    (await api.put<UserRecord>(`/api/v1/users/${userId}`, request)).data,

  deleteUser: async (userId: number) =>
    api.delete(`/api/v1/users/${userId}`),

  getUser: async (userId: number) =>
    (await api.get<UserRecord>(`/api/v1/users/${userId}`)).data,

  getHospitalStaff: async (hospitalId: number, role?: string) =>
    pageContent(
      (
        await api.get<PageResponse<UserRecord>>(
          `/api/v1/hospitals/${hospitalId}/staff`,
          { params: { ...pageParams, ...(role ? { role } : {}) } },
        )
      ).data,
    ),

  createHospitalStaff: async (hospitalId: number, request: UserRequest) =>
    (
      await api.post<UserRecord>(
        `/api/v1/hospitals/${hospitalId}/staff`,
        request,
      )
    ).data,

  updateHospitalStaff: async (
    hospitalId: number,
    staffId: number,
    request: UserRequest,
  ) =>
    (
      await api.put<UserRecord>(
        `/api/v1/hospitals/${hospitalId}/staff/${staffId}`,
        request,
      )
    ).data,

  deactivateHospitalStaff: async (hospitalId: number, staffId: number) =>
    api.patch(
      `/api/v1/hospitals/${hospitalId}/staff/${staffId}/deactivate`,
    ),

  getHospitalDoctors: async (hospitalId: number) =>
    pageContent(
      (
        await api.get<PageResponse<UserRecord>>(
          `/api/v1/hospitals/${hospitalId}/doctors`,
          { params: pageParams },
        )
      ).data,
    ),

  createHospitalDoctor: async (hospitalId: number, request: UserRequest) =>
    (
      await api.post<UserRecord>(
        `/api/v1/hospitals/${hospitalId}/doctors`,
        request,
      )
    ).data,

  updateHospitalDoctor: async (
    hospitalId: number,
    doctorId: number,
    request: UserRequest,
  ) =>
    (
      await api.put<UserRecord>(
        `/api/v1/hospitals/${hospitalId}/doctors/${doctorId}`,
        request,
      )
    ).data,

  getDepartmentQueue: async (departmentId: number, status?: string) =>
    pageContent(
      (
        await api.get<PageResponse<QueueTicketRecord>>(
          `/api/v1/departments/${departmentId}/queue-tickets`,
          {
            params: {
              ...pageParams,
              ...(status ? { status } : {}),
            },
          },
        )
      ).data,
    ),

  callNext: async (departmentId: number) =>
    (
      await api.post<QueueTicketRecord>(
        `/api/v1/departments/${departmentId}/queue/call-next`,
      )
    ).data,

  skipQueueTicket: async (departmentId: number, ticketId: number) =>
    (
      await api.post<QueueTicketRecord>(
        `/api/v1/departments/${departmentId}/queue-tickets/${ticketId}/skip`,
      )
    ).data,

  completeQueueTicket: async (departmentId: number, ticketId: number) =>
    (
      await api.post<QueueTicketRecord>(
        `/api/v1/departments/${departmentId}/queue-tickets/${ticketId}/complete`,
      )
    ).data,

  getHospitalEmergencyCases: async (hospitalId: number) =>
    pageContent(
      (
        await api.get<PageResponse<EmergencyRecord>>(
          `/api/v1/hospitals/${hospitalId}/emergency-cases`,
          { params: pageParams },
        )
      ).data,
    ),

  updateEmergencyStatus: async (
    hospitalId: number,
    caseId: number,
    status: string,
  ) =>
    (
      await api.patch<EmergencyRecord>(
        `/api/v1/hospitals/${hospitalId}/emergency-cases/${caseId}/status`,
        { status },
      )
    ).data,

  resolveEmergency: async (hospitalId: number, caseId: number) =>
    (
      await api.post<EmergencyRecord>(
        `/api/v1/hospitals/${hospitalId}/emergency-cases/${caseId}/resolve`,
      )
    ).data,

  getHospitalDoctorsAdmin: async (hospitalId: number) =>
    pageContent(
      (
        await api.get<PageResponse<UserRecord>>(
          `/api/v1/hospitals/${hospitalId}/doctors`,
          { params: pageParams },
        )
      ).data,
    ),

  setDoctorAvailability: async (
    hospitalId: number,
    doctorId: number,
    onDuty: boolean,
  ) =>
    (
      await api.patch<UserRecord>(
        `/api/v1/hospitals/${hospitalId}/doctors/${doctorId}/availability`,
        { onDuty },
      )
    ).data,

  createClinicalRecord: async (
    ticketId: number,
    request: {
      diagnosis: string;
      treatment: string;
      prescription?: string;
    },
  ) =>
    (
      await api.post<ClinicalRecord>(
        `/api/v1/queue-tickets/${ticketId}/clinical-records`,
        request,
      )
    ).data,
};
