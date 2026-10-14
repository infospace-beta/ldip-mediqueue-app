export type PatientPriority = 'Normal' | 'Priority' | 'Emergency'
export type QueueStatus = 'Waiting' | 'Called' | 'In Consultation' | 'Delayed' | 'Emergency' | 'Priority' | 'Completed'
export type DepartmentStatus = 'Open' | 'Busy' | 'At Capacity'

export interface Patient {
  id: string
  queueNumber: string
  name: string
  mrn: string
  age: number
  department: string
  priority: PatientPriority
  waitingMinutes: number
  status: QueueStatus
  phone?: string
  clinicalNotes?: string
  appointmentDate?: string
  appointmentTime?: string
}

export interface EmergencyRequest {
  id: string
  requestNumber: string
  patientType: string
  complaint: string
  reportedAt: string
  assignedTo: string
  responder: string
  eta: string
  location: string
  severity: 'Critical' | 'High' | 'Moderate'
  status: 'New' | 'Accepted' | 'Dispatched' | 'On Scene' | 'Resolved' | 'Escalated'
  timeline: Array<{ time: string; event: string }>
}

export interface Department {
  id: string
  name: string
  waiting: number
  inConsultation: number
  emergencyCases: number
  doctorsAvailable: number
  status: DepartmentStatus
}

export interface NotificationItem {
  id: string
  title: string
  detail: string
  time: string
  type: 'info' | 'warning' | 'danger' | 'success'
}

export interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  initials: string
  avatarColor: string
}

export interface SummaryMetric {
  label: string
  value: number
  trend?: string
  tone?: 'primary' | 'success' | 'warning' | 'danger'
}

export interface ReportMetric {
  label: string
  value: string
  detail: string
}
