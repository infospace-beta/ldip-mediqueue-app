<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, ClipboardList, Clock3, Search, Settings, ShieldAlert, UserRound, UsersRound } from '@lucide/vue'
import ResponderEmptyState from '../components/Responder/ResponderEmptyState.vue'

const route = useRoute()
const sections = {
  emergencies: { title: 'Emergency data unavailable', description: 'The responder service is not connected, so emergency requests cannot be loaded.', icon: ShieldAlert },
  patients: { title: 'Patient data unavailable', description: 'The responder service is not connected, so assigned patient records cannot be loaded.', icon: UsersRound },
  queue: { title: 'Queue data unavailable', description: 'Queue activity cannot be loaded until the responder service is connected.', icon: Clock3 },
  notifications: { title: 'Notification data unavailable', description: 'Notifications cannot be loaded until the responder service is connected.', icon: Bell },
  history: { title: 'Response history unavailable', description: 'Response history cannot be loaded until the responder service is connected.', icon: ClipboardList },
  profile: { title: 'Profile not connected', description: 'Responder profile details will appear here when connected.', icon: UserRound },
  settings: { title: 'Settings unavailable', description: 'Responder settings will appear here when connected.', icon: Settings },
}
const section = computed(() => {
  const key = route.meta.section
  if (typeof key === 'string' && key in sections) {
    return sections[key as keyof typeof sections]
  }
  return { title: 'No active emergencies', description: 'Emergency requests will appear here when assigned.', icon: Search }
})
</script>

<template>
  <section class="responder-section-view responder-panel">
    <span class="responder-eyebrow">{{ route.meta.title }}</span>
    <ResponderEmptyState :title="section.title" :description="section.description" :icon="section.icon" />
  </section>
</template>
