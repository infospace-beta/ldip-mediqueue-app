<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    collapsed?: boolean
    mobileOpen?: boolean
    profile?: { name: string; role: string; initials: string }
  }>(),
  {
    collapsed: false,
    mobileOpen: false,
    profile: () => ({ name: 'Nadia Mugo', role: 'Charge Nurse', initials: 'NM' }),
  },
)

const route = useRoute()
const router = useRouter()

const navItems = [
  { label: 'Dashboard', path: '/staff/dashboard', icon: '⌂' },
  { label: 'Patient Queue', path: '/staff/queue', icon: '☰' },
  { label: 'Emergency', path: '/staff/emergency', icon: '⚑' },
  { label: 'Departments', path: '/staff/departments', icon: '▣' },
  { label: 'Reports', path: '/staff/reports', icon: '◫' },
  { label: 'Settings', path: '/staff/settings', icon: '⚙' },
]

const isActive = (path: string) => computed(() => route.path === path)

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <aside
    class="app-sidebar"
    :class="{ 'app-sidebar--collapsed': props.collapsed, 'app-sidebar--mobile-open': props.mobileOpen }"
  >
    <div class="sidebar__brand">
      <img class="brand-mark" src="/mediqueue-mark.svg" alt="MediQueue" />
      <div v-if="!props.collapsed" class="brand-copy">
        <span class="brand-name">MediQueue</span>
      </div>
    </div>

    <nav class="sidebar__nav" aria-label="Main navigation">
      <button
        v-for="item in navItems"
        :key="item.path"
        type="button"
        class="nav-item"
        :class="{ 'nav-item--active': isActive(item.path).value }"
        @click="navigate(item.path)"
      >
        <span class="nav-item__icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="nav-item__label" v-if="!props.collapsed">{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar__profile" v-if="!props.collapsed">
      <div class="profile-avatar">{{ props.profile.initials }}</div>
      <div class="profile-copy">
        <strong>{{ props.profile.name }}</strong>
        <span>{{ props.profile.role }}</span>
      </div>
      <button type="button" class="logout-button">Logout</button>
    </div>
  </aside>
</template>
