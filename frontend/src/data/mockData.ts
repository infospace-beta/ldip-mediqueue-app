import type { Department, EmergencyRequest, NotificationItem, Patient, ReportMetric, StaffMember, SummaryMetric } from '../types'

export const staffProfile: StaffMember = {
  id: 'ST-104',
  name: 'Nadia Mugo',
  role: 'Charge Nurse',
  department: 'Cardiology',
  initials: 'NM',
  avatarColor: '#2EC4A6',
}

export const summaryMetrics: SummaryMetric[] = [
  { label: 'Patients Waiting', value: 0, trend: 'No patients queued', tone: 'primary' },
  { label: 'In Consultation', value: 0, trend: 'No active consults', tone: 'success' },
  { label: 'Emergency Cases', value: 0, trend: 'No active alerts', tone: 'danger' },
  { label: 'Completed Today', value: 0, trend: 'No completed visits', tone: 'warning' },
]

export const patients: Patient[] = []

export const emergencyRequests: EmergencyRequest[] = []

export const departments: Department[] = [
  { id: 'dep-001', name: 'General Consultation', waiting: 0, inConsultation: 0, emergencyCases: 0, doctorsAvailable: 0, status: 'Open' },
  { id: 'dep-002', name: 'Cardiology', waiting: 0, inConsultation: 0, emergencyCases: 0, doctorsAvailable: 0, status: 'Open' },
  { id: 'dep-003', name: 'Pediatrics', waiting: 0, inConsultation: 0, emergencyCases: 0, doctorsAvailable: 0, status: 'Open' },
  { id: 'dep-004', name: 'Emergency', waiting: 0, inConsultation: 0, emergencyCases: 0, doctorsAvailable: 0, status: 'Open' },
  { id: 'dep-005', name: 'Laboratory', waiting: 0, inConsultation: 0, emergencyCases: 0, doctorsAvailable: 0, status: 'Open' },
  { id: 'dep-006', name: 'Pharmacy', waiting: 0, inConsultation: 0, emergencyCases: 0, doctorsAvailable: 0, status: 'Open' },
]

export const notifications: NotificationItem[] = []

export const reports: ReportMetric[] = [
  { label: 'Patients served today', value: '0', detail: 'No patients served yet' },
  { label: 'Average waiting time', value: '0 min', detail: 'Queue is idle' },
  { label: 'Average consultation time', value: '0 min', detail: 'No active sessions' },
  { label: 'Emergency cases', value: '0', detail: 'No emergency calls' },
  { label: 'Completed consultations', value: '0', detail: 'No completed visits' },
  { label: 'Department performance', value: '0%', detail: 'No activity yet' },
]
