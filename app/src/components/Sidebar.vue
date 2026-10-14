<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Activity, CalendarDays, ClipboardList, Clock3, LayoutDashboard, LogOut, Settings, ShieldPlus, UserRound, UsersRound, X } from '@lucide/vue'

defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const route = useRoute()
const router = useRouter()
const primary = [
  { label: 'Dashboard', to: '/patient/dashboard', icon: LayoutDashboard },
  { label: 'Join queue', to: '/patient/join-queue', icon: UsersRound },
  { label: 'My queue', to: '/patient/queue', icon: Clock3 },
  { label: 'Emergency', to: '/patient/emergency', icon: ShieldPlus },
  { label: 'Appointments', to: '/patient/appointments', icon: CalendarDays },
]
const care = [
  { label: 'Notifications', to: '/patient/notifications', icon: Activity },
  { label: 'Medical history', to: '/patient/history', icon: ClipboardList },
  { label: 'My profile', to: '/patient/profile', icon: UserRound },
  { label: 'Settings', to: '/patient/settings', icon: Settings },
]
const activePath = computed(() => route.path)
function isActive(item) {
  if (item.label === 'Join queue') return activePath.value === item.to
  return activePath.value === item.to
}
function logout() {
  router.push('/patient/dashboard')
  emit('close')
}
</script>

<template>
  <div v-if="open" class="mobile-scrim" @click="emit('close')"></div>
  <aside class="sidebar" :class="{ 'sidebar-open': open }" aria-label="Main navigation">
    <div class="brand-row">
      <RouterLink class="brand" to="/patient/dashboard" @click="emit('close')">
        <img class="brand-mark brand-image" :src="'/Mediqueue-logo.jpeg'" alt="" />
        <span class="brand-copy"><strong>MEDIQUEUE</strong><small>YOUR HEALTH â€¢ OUR PRIORITY</small></span>
      </RouterLink>
      <button class="icon-button sidebar-close" type="button" aria-label="Close navigation" @click="emit('close')"><X :size="19" /></button>
    </div>

    <div class="sidebar-label">PATIENT PORTAL</div>
    <nav class="sidebar-nav" aria-label="Patient dashboard">
      <RouterLink v-for="item in primary" :key="item.label" :to="item.to" class="nav-link" :class="{ active: isActive(item) }" @click="emit('close')">
        <component :is="item.icon" :size="18" :stroke-width="1.8" /><span>{{ item.label }}</span>
        <span v-if="item.label === 'My queue'" class="nav-count">0</span>
      </RouterLink>
    </nav>

    <div class="sidebar-label sidebar-label-spaced">YOUR CARE</div>
    <nav class="sidebar-nav" aria-label="Patient account">
      <RouterLink v-for="item in care" :key="item.label" :to="item.to" class="nav-link" :class="{ active: isActive(item) }" @click="emit('close')">
        <component :is="item.icon" :size="18" :stroke-width="1.8" /><span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-bottom">
      <div class="help-card">
        <span class="help-icon"><Activity :size="17" /></span>
        <strong>Need a hand?</strong>
        <span>Patient support</span>
        <span class="help-contact-note">Support contact will appear here when connected.</span>
      </div>
      <button class="nav-link logout-link" type="button" @click="logout"><LogOut :size="18" /><span>Log out</span></button>
      <div class="sidebar-version">MediQueue Â· Patient portal <span>v1.0.0</span></div>
    </div>
  </aside>
</template>

