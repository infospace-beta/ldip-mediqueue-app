<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import { staffProfile } from './data/mockData'

const route = useRoute()
const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)
const searchValue = ref('')
const theme = ref<'light' | 'dark'>('light')

const pageTitle = computed(() => {
  const routes: Record<string, string> = {
    '/staff/dashboard': 'Staff Dashboard',
    '/staff/queue': 'Patient Queue',
    '/staff/emergency': 'Emergency Management',
    '/staff/departments': 'Departments',
    '/staff/reports': 'Reports',
    '/staff/settings': 'Settings',
  }

  return routes[route.path] ?? 'MediQueue'
})

const unreadCount = computed(() => 4)

watch(
  () => route.path,
  () => {
    mobileSidebarOpen.value = false
  },
)

watch(
  theme,
  (value) => {
    document.documentElement.setAttribute('data-theme', value)
    document.documentElement.style.colorScheme = value
  },
  { immediate: true },
)

function toggleSidebar() {
  if (window.innerWidth <= 980) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
    return
  }

  sidebarCollapsed.value = !sidebarCollapsed.value
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div class="app-shell" :data-theme="theme">
    <div v-if="mobileSidebarOpen" class="mobile-backdrop" @click="mobileSidebarOpen = false"></div>

    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      :profile="staffProfile"
    />

    <div class="content-area">
      <AppHeader
        :title="pageTitle"
        :department="staffProfile.department"
        :notification-count="unreadCount"
        :profile="staffProfile"
        :search-value="searchValue"
        :theme="theme"
        @toggle-sidebar="toggleSidebar"
        @toggle-theme="toggleTheme"
        @search-change="(value) => (searchValue = value)"
      />

      <main class="page-shell">
        <router-view />
      </main>
    </div>
  </div>
</template>
