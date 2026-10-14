import { computed, ref } from 'vue'

export const emergencyRequests = ref([])
export const assignedPatients = ref([])
export const notifications = ref([])
export const responseHistory = ref([])
export const queueItems = ref([])

export const responderStats = computed(() => ({
  activeEmergencies: emergencyRequests.value.length,
  assignedPatients: assignedPatients.value.length,
  pendingRequests: emergencyRequests.value.filter((request) => request.status === 'Pending').length,
  completedResponses: responseHistory.value.length,
  waiting: queueItems.value.filter((item) => item.status === 'Waiting').length,
  inProgress: queueItems.value.filter((item) => item.status === 'In Progress').length,
  completed: queueItems.value.filter((item) => item.status === 'Completed').length,
}))

function apiNotConnected() {
  throw new Error('Responder API is not connected.')
}

export async function fetchEmergencyRequests() {
  return apiNotConnected()
}

export async function fetchAssignedPatients() {
  return apiNotConnected()
}

export async function fetchNotifications() {
  return apiNotConnected()
}

export async function fetchResponseHistory() {
  return apiNotConnected()
}