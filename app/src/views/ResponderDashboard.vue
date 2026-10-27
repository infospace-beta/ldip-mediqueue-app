<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Activity, Bell, ClipboardList, ShieldAlert, UsersRound } from '@lucide/vue'
import ResponderSidebar from '../components/Responder/ResponderSidebar.vue'
import ResponderTopbar from '../components/Responder/ResponderTopbar.vue'
import ResponderDataTable from '../components/Responder/ResponderDataTable.vue'
import ResponderQueueStatus from '../components/Responder/ResponderQueueStatus.vue'
import { assignedPatients, emergencyRequests, responseHistory, type ResponderRecord } from '../components/Responder/data.js'
import '../assets/responder.css'

const route = useRoute()
const mobileMenuOpen = ref(false)
const darkMode = ref(false)
const searchQuery = ref('')
const filteredEmergencyRequests = computed(() => filterLocalRecords(emergencyRequests.value))
const filteredAssignedPatients = computed(() => filterLocalRecords(assignedPatients.value))

function filterLocalRecords(records: ResponderRecord[]) {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return records
  return records.filter((record) => Object.values(record).some((value) => String(value ?? '').toLowerCase().includes(query)))
}

function loadTheme() {
  const savedTheme = localStorage.getItem('mediqueue-responder-theme')
  darkMode.value = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
}
function toggleTheme() {
  darkMode.value = !darkMode.value
  localStorage.setItem('mediqueue-responder-theme', darkMode.value ? 'dark' : 'light')
}
function handleKeydown(event: KeyboardEvent) {
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
      <ResponderTopbar :title="String(route.meta.title || 'Responder Dashboard')" :dark="darkMode" :searchable="route.meta.section === 'dashboard'" @search="searchQuery = $event" @toggle-menu="mobileMenuOpen = !mobileMenuOpen" @toggle-theme="toggleTheme" />
      <main id="responder-main-content" class="responder-content">
        <RouterView v-if="route.meta.section !== 'dashboard'" />
        <div v-else class="responder-dashboard-content">
          <section class="responder-welcome">
            <span class="responder-welcome-mark"><Activity :size="20" /></span>
            <div class="responder-welcome-copy"><span class="responder-eyebrow">RESPONSE WORKSPACE</span><h2>Responder Dashboard</h2><p>Responder services are not connected. Operational records and live status are unavailable.</p></div>
            <img
              class="responder-welcome-image"
              src="../assets/images/mat-napo-Ygyp2kXy2I0-unsplash.jpg"
              alt="Emergency responders assisting a patient beside an ambulance"
              width="176"
              height="112"
              decoding="async"
            />
          </section>
          <div class="responder-dashboard-grid">
            <div class="responder-main-column">
              <ResponderDataTable title="Emergency requests" subtitle="Records in this browser session only; live responder data is unavailable." :columns="[{ key: 'requestId', label: 'Request ID' }, { key: 'patient', label: 'Patient' }, { key: 'emergencyType', label: 'Emergency type' }, { key: 'priority', label: 'Priority' }, { key: 'location', label: 'Location' }, { key: 'status', label: 'Status' }]" :rows="filteredEmergencyRequests" :empty-title="searchQuery ? 'No matching session records' : 'Emergency data unavailable'" :empty-description="searchQuery ? 'No local session record matches this search. Live responder data is not connected.' : 'The responder service is not connected, so emergency requests cannot be loaded.'" :icon="ShieldAlert" />
              <ResponderDataTable title="Assigned patients" subtitle="Records in this browser session only; live responder data is unavailable." :columns="[{ key: 'patientId', label: 'Patient ID' }, { key: 'patient', label: 'Patient' }, { key: 'emergencyType', label: 'Emergency type' }, { key: 'location', label: 'Location' }, { key: 'priority', label: 'Priority' }, { key: 'status', label: 'Status' }]" :rows="filteredAssignedPatients" :empty-title="searchQuery ? 'No matching session records' : 'Patient data unavailable'" :empty-description="searchQuery ? 'No local session record matches this search. Live responder data is not connected.' : 'The responder service is not connected, so assigned patient records cannot be loaded.'" :icon="UsersRound" />
            </div>
            <aside class="responder-side-column" aria-label="Queue and notifications">
              <ResponderQueueStatus />
              <section class="responder-panel responder-notifications-panel"><div class="responder-panel-heading"><div><span class="responder-eyebrow">UPDATES</span><h2>Notifications</h2></div></div><div class="responder-notification-empty"><Bell :size="18" /><div><strong>Notification data unavailable</strong><p>The responder service is not connected.</p></div></div></section>
              <section class="responder-panel responder-activity-panel"><div class="responder-panel-heading"><div><span class="responder-eyebrow">ACTIVITY</span><h2>Response history</h2></div></div><div class="responder-activity-empty"><ClipboardList :size="17" /><span>{{ responseHistory.length ? `${responseHistory.length} local session record(s); live history unavailable.` : 'Response history is unavailable until the responder service is connected.' }}</span></div></section>
            </aside>
          </div>
        </div>
      </main>
      <footer class="responder-footer"><span><i></i> Responder data unavailable · Service not connected</span><span>MediQueue · Response portal</span></footer>
    </div>
  </div>
</template>
