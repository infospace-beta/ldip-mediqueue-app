import type { ComputedRef, Ref } from 'vue'

export interface ResponderRecord {
  id?: string | number
  requestId?: string | number
  patientId?: string | number
  [key: string]: string | number | null | undefined
}

export const emergencyRequests: Ref<ResponderRecord[]>
export const assignedPatients: Ref<ResponderRecord[]>
export const notifications: Ref<ResponderRecord[]>
export const responseHistory: Ref<ResponderRecord[]>
export const queueItems: Ref<ResponderRecord[]>
export const responderStats: ComputedRef<Record<string, number>>

export function fetchEmergencyRequests(): Promise<never>
export function fetchAssignedPatients(): Promise<never>
export function fetchNotifications(): Promise<never>
export function fetchResponseHistory(): Promise<never>
