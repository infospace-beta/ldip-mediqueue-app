<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, ClipboardList, Clock3, Search, Settings, ShieldAlert, UserRound, UsersRound } from '@lucide/vue'
import ResponderEmptyState from '../components/Responder/ResponderEmptyState.vue'
import { useAuthStore } from '@/stores/auth.store'
import { mediqueueService, type NotificationRecord } from '@/services/mediqueue.service'

const route = useRoute()
const auth = useAuthStore()
const notifications = ref<NotificationRecord[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const sections = {
  emergencies: { title: 'Responder case list unavailable', description: 'The backend returns assigned-case counts but does not provide a responder-scoped case list.', icon: ShieldAlert },
  patients: { title: 'Assigned patient list unavailable', description: 'The current API does not provide a responder-scoped patient list.', icon: UsersRound },
  queue: { title: 'Responder queue unavailable', description: 'The current API does not expose a responder-specific queue listing.', icon: Clock3 },
  notifications: { title: 'Notifications', description: 'Updates from your authenticated MediQueue account.', icon: Bell },
  history: { title: 'Response history unavailable', description: 'The current API does not provide responder response-history records.', icon: ClipboardList },
  profile: { title: 'Responder profile', description: 'Profile information for the signed-in responder account.', icon: UserRound },
  settings: { title: 'Responder settings unavailable', description: 'The backend does not currently expose a responder settings endpoint.', icon: Settings },
}
const section = computed(() => {
  const key = route.meta.section
  if (typeof key === 'string' && key in sections) {
    return sections[key as keyof typeof sections]
  }
  return { title: 'No active emergencies', description: 'Emergency requests will appear here when assigned.', icon: Search }
})

async function loadNotifications() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    notifications.value = await mediqueueService.getNotifications()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load notifications.'
  } finally {
    isLoading.value = false
  }
}

async function markRead(item: NotificationRecord) {
  errorMessage.value = ''
  try {
    await mediqueueService.markNotificationRead(item.id)
    item.unread = false
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to mark the notification as read.'
  }
}

onMounted(() => {
  if (route.meta.section === 'notifications') void loadNotifications()
})
</script>

<template>
  <section class="responder-section-view responder-panel">
    <span class="responder-eyebrow">{{ route.meta.title }}</span>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
    <p v-if="isLoading" role="status">Loading notifications…</p>
    <template v-if="route.meta.section === 'notifications' && !isLoading">
      <h2>{{ section.title }}</h2>
      <p>{{ section.description }}</p>
      <ul v-if="notifications.length" class="responder-notification-list">
        <li v-for="item in notifications" :key="item.id">
          <strong>{{ item.title }}</strong>
          <p>{{ item.message }}</p>
          <time>{{ new Date(item.createdAt).toLocaleString() }}</time>
          <button v-if="item.unread" type="button" @click="markRead(item)">Mark read</button>
        </li>
      </ul>
      <p v-else>No notifications were returned.</p>
    </template>
    <section v-else-if="route.meta.section === 'profile'">
      <h2>{{ section.title }}</h2>
      <p>{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
      <p>{{ auth.user?.email || auth.user?.username }}</p>
      <p>{{ auth.user?.backendRole || "RESPONDER" }}</p>
    </section>
    <ResponderEmptyState v-else :title="section.title" :description="section.description" :icon="section.icon" />
  </section>
</template>
