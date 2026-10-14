<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Activity, Bell, ClipboardCheck, ClipboardList, Clock3, ShieldAlert, UsersRound } from '@lucide/vue'
import ResponderSidebar from '../components/Responder/ResponderSidebar.vue'
import ResponderTopbar from '../components/Responder/ResponderTopbar.vue'
import ResponderStatCard from '../components/Responder/ResponderStatCard.vue'
import ResponderDataTable from '../components/Responder/ResponderDataTable.vue'
import ResponderQueueStatus from '../components/Responder/ResponderQueueStatus.vue'
import { assignedPatients, emergencyRequests, notifications, responderStats, responseHistory } from '../components/Responder/data.js'
import '../assets/responder.css'

const route = useRoute()
const mobileMenuOpen = ref(false)
const darkMode = ref(false)
const stats = [
  { label: 'Active Emergencies', key: 'activeEmergencies', detail: 'No active cases', icon: ShieldAlert, tone: 'red' },
  { label: 'Assigned Patients', key: 'assignedPatients', detail: 'No patients assigned', icon: UsersRound, tone: 'blue' },
  { label: 'Pending Requests', key: 'pendingRequests', detail: 'No pending requests', icon: Clock3, tone: 'amber' },
  { label: 'Completed Responses', key: 'completedResponses', detail: 'No completed responses', icon: ClipboardCheck, tone: 'green' },
]
const queueCounts = responderStats

function loadTheme() {
  const savedTheme = localStorage.getItem('mediqueue-responder-theme')
  darkMode.value = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
}
function toggleTheme() {
  darkMode.value = !darkMode.value
  localStorage.setItem('mediqueue-responder-theme', darkMode.value ? 'dark' : 'light')
}
function handleKeydown(event) {
  if (event.key === 'Escape') mobileMenuOpen.value = false
}

onMounted(() => {
  loadTheme()
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="responder-app" :data-theme="darkMode ? 'dark' : 'light'">
    <ResponderSidebar :open="mobileMenuOpen" @close="mobileMenuOpen = false" />
    <div class="responder-main">
      <ResponderTopbar :title="String(route.meta.title || 'Responder Dashboard')" :dark="darkMode" :notification-count="notifications.length" @toggle-menu="mobileMenuOpen = !mobileMenuOpen" @toggle-theme="toggleTheme" />
      <main class="responder-content" id="responder-main-content">
        <RouterView v-if="route.meta.section !== 'dashboard'" />
        <div v-else class="responder-dashboard-content">
          <section class="responder-welcome">
            <span class="responder-welcome-mark"><Activity :size="20" /></span>
            <div><span class="responder-eyebrow">RESPONSE OVERVIEW</span><h2>Responder Dashboard</h2><p>Monitor active response activity and queue status.</p></div>
            <span class="responder-availability"><i></i> Available</span>
          </section>
          <section class="responder-stat-grid" aria-label="Response summary">
            <ResponderStatCard v-for="item in stats" :key="item.label" :label="item.label" :value="queueCounts[item.key]" :detail="item.detail" :icon="item.icon" :tone="item.tone" />
          </section>
          <div class="responder-dashboard-grid">
            <div class="responder-main-column">
              <ResponderDataTable title="Emergency requests" subtitle="Incoming requests assigned to your response team" :columns="[{ key: 'requestId', label: 'Request ID' }, { key: 'patient', label: 'Patient' }, { key: 'emergencyType', label: 'Emergency Type' }, { key: 'priority', label: 'Priority' }, { key: 'location', label: 'Location' }, { key: 'status', label: 'Status' }, { key: 'action', label: 'Action' }]" :rows="emergencyRequests" empty-title="No emergency requests" empty-description="Emergency requests will appear here when assigned." :icon="ShieldAlert" />
              <ResponderDataTable title="Assigned patients" subtitle="Patients currently assigned to your care" :columns="[{ key: 'patientId', label: 'Patient ID' }, { key: 'patient', label: 'Patient' }, { key: 'emergencyType', label: 'Emergency Type' }, { key: 'location', label: 'Location' }, { key: 'priority', label: 'Priority' }, { key: 'status', label: 'Status' }, { key: 'action', label: 'Action' }]" :rows="assignedPatients" empty-title="No patients assigned" empty-description="Assigned patients will appear here." :icon="UsersRound" />
            </div>
            <aside class="responder-side-column" aria-label="Queue and notifications">
              <ResponderQueueStatus :waiting="queueCounts.waiting" :in-progress="queueCounts.inProgress" :completed="queueCounts.completed" />
              <section class="responder-panel responder-notifications-panel"><div class="responder-panel-heading"><div><span class="responder-eyebrow">UPDATES</span><h2>Notifications</h2></div><span class="responder-total">{{ notifications.length }} NEW</span></div><div class="responder-notification-empty"><Bell :size="18" /><div><strong>No new notifications</strong><p>You're up to date.</p></div></div></section>
              <section class="responder-panel responder-activity-panel"><div class="responder-panel-heading"><div><span class="responder-eyebrow">ACTIVITY</span><h2>Response history</h2></div><span class="responder-total">{{ responseHistory.length }} TOTAL</span></div><div class="responder-activity-empty"><ClipboardList :size="17" /><span>No response history</span></div></section>
            </aside>
          </div>
        </div>
      </main>
      <footer class="responder-footer"><span><i></i> Responder system status: not connected</span><span>MediQueue Â· Response portal</span></footer>
    </div>
  </div>
</template>

