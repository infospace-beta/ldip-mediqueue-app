<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, ClipboardList, Clock3, Search, Settings, ShieldAlert, UserRound, UsersRound } from '@lucide/vue'
import ResponderEmptyState from '../components/Responder/ResponderEmptyState.vue'

const route = useRoute()
const sections = {
  emergencies: { title: 'No emergency requests', description: 'Emergency requests will appear here when assigned.', icon: ShieldAlert },
  patients: { title: 'No patients assigned', description: 'Assigned patients will appear here.', icon: UsersRound },
  queue: { title: 'Queue is empty', description: 'Queue activity will appear here when available.', icon: Clock3 },
  notifications: { title: 'No new notifications', description: 'Notifications will appear here when received.', icon: Bell },
  history: { title: 'No response history', description: 'Completed responses will appear here.', icon: ClipboardList },
  profile: { title: 'Profile not connected', description: 'Responder profile details will appear here when connected.', icon: UserRound },
  settings: { title: 'Settings unavailable', description: 'Responder settings will appear here when connected.', icon: Settings },
}
const section = computed(() => sections[route.meta.section] || { title: 'No active emergencies', description: 'Emergency requests will appear here when assigned.', icon: Search })
</script>

<template>
  <section class="responder-section-view responder-panel">
    <span class="responder-eyebrow">{{ route.meta.title }}</span>
    <ResponderEmptyState :title="section.title" :description="section.description" :icon="section.icon" />
  </section>
</template>