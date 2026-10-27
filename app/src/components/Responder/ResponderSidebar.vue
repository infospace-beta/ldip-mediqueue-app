<script setup lang="ts">
import { Bell, ClipboardList, Clock3, LayoutDashboard, LogOut, Settings, ShieldAlert, UserRound, UsersRound, X } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'

defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const router = useRouter()
const auth = useAuthStore()
const links = [
  { label: 'Dashboard', to: '/responder/dashboard', icon: LayoutDashboard },
  { label: 'Emergency Requests', to: '/responder/emergencies', icon: ShieldAlert },
  { label: 'Assigned Patients', to: '/responder/patients', icon: UsersRound },
  { label: 'Queue', to: '/responder/queue', icon: Clock3 },
  { label: 'Notifications', to: '/responder/notifications', icon: Bell },
  { label: 'Response History', to: '/responder/history', icon: ClipboardList },
  { label: 'Profile', to: '/responder/profile', icon: UserRound },
  { label: 'Settings', to: '/responder/settings', icon: Settings },
]

async function logout() {
  emit('close')
  auth.logout()
  await router.push('/')
}
</script>

<template>
  <button v-if="open" class="responder-scrim" type="button" aria-label="Close navigation" @click="emit('close')"></button>
  <aside class="responder-sidebar" :class="{ 'responder-sidebar-open': open }" aria-label="Responder navigation">
    <div class="responder-brand-row">
      <RouterLink class="responder-brand" to="/responder/dashboard" @click="emit('close')">
        <img class="responder-brand-mark" :src="'/mediqueue-logo.png'" alt="" />
        <span><strong>MediQueue</strong><small>RESPONSE PORTAL</small></span>
      </RouterLink>
      <button class="responder-icon-button responder-sidebar-close" type="button" aria-label="Close navigation" @click="emit('close')"><X :size="19" /></button>
    </div>
    <p class="responder-nav-label">WORKSPACE</p>
    <nav class="responder-nav" aria-label="Responder workspace">
      <RouterLink v-for="item in links" :key="item.to" :to="item.to" class="responder-nav-link" active-class="is-active" @click="emit('close')">
        <component :is="item.icon" :size="18" :stroke-width="1.8" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
    <div class="responder-sidebar-footer">
      <div class="responder-connection"><span></span><span><strong>Operational data</strong><small>Service not connected</small></span></div>
      <button class="responder-nav-link responder-logout" type="button" @click="logout"><LogOut :size="18" /><span>Log out</span></button>
      <small class="responder-version">MediQueue · Responder portal</small>
    </div>
  </aside>
</template>
