<script setup>
import { computed, ref } from 'vue'
import { Bell, CalendarDays, ChevronDown, Clock3, Info, LogOut, Menu, Search, Settings, UserRound } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { notifications, patient, unreadCount } from '../data/patient'

const props = defineProps({ title: String, menuOpen: Boolean })
defineEmits(['toggle-menu'])
const router = useRouter()
const search = ref('')
const openMenu = ref('')
const unread = computed(() => unreadCount())
const pageTitle = computed(() => props.title === 'Dashboard' ? 'Patient Dashboard' : props.title)
function searchSubmit() {
  const query = search.value.trim().toLowerCase()
  if (!query) return
  let destination = '/patient/join-queue'
  if (query.includes('appointment')) destination = '/patient/appointments'
  else if (query.includes('queue')) destination = '/patient/queue'
  router.push(destination)
  search.value = ''
}
function markRead(item) {
  item.unread = false
  openMenu.value = ''
  router.push('/patient/notifications')
}  
</script>

<template>
  <header class="topbar">
    <button class="icon-button mobile-menu-trigger" type="button" :aria-label="props.menuOpen ? 'Close navigation' : 'Open navigation'" aria-controls="patient-sidebar" :aria-expanded="props.menuOpen" @click="$emit('toggle-menu')"><Menu :size="21" /></button>
    <div class="topbar-heading">
      <p class="greeting">{{ pageTitle || 'Patient Dashboard' }}</p>
      <p class="topbar-date">Welcome back, {{ patient.name || 'Patient' }}</p>
    </div>
    <form class="search-box" role="search" @submit.prevent="searchSubmit">
      <Search :size="17" /><input v-model="search" aria-label="Search hospitals and services" placeholder="Search hospitals, services..." />    </form>
    <div class="topbar-actions">
      <div class="popover-anchor">
        <button class="icon-button notification-trigger" type="button" :aria-label="unread ? `Notifications, ${unread} unread` : 'Notifications'" :aria-expanded="openMenu === 'notifications'" @click="openMenu = openMenu === 'notifications' ? '' : 'notifications'">
          <Bell :size="19" /><span v-if="unread" class="notification-dot">{{ unread }}</span>
        </button>
        <div v-if="openMenu === 'notifications'" class="top-popover notification-popover">
          <div class="popover-heading"><strong>Notifications</strong><RouterLink to="/patient/notifications" @click="openMenu = ''">View all</RouterLink></div>
          <button v-for="item in notifications.slice(0, 3)" :key="item.id" class="popover-notification" :class="{ 'popover-unread': item.unread }" type="button" @click="markRead(item)">
            <span class="notification-marker" :class="`marker-${item.kind}`"><Clock3 v-if="item.kind === 'queue'" :size="15" /><CalendarDays v-else-if="item.kind === 'appointment'" :size="15" /><Info v-else :size="15" /></span>
            <span><strong>{{ item.title }}</strong><small>{{ item.message }}</small><time>{{ item.time }}</time></span>
          </button>
          <p v-if="!notifications.length" class="popover-empty">No new notifications</p>
        </div>
      </div>
      <div class="popover-anchor profile-anchor">
        <button class="profile-trigger" type="button" :aria-expanded="openMenu === 'profile'" @click="openMenu = openMenu === 'profile' ? '' : 'profile'">
          <span class="avatar avatar-small">{{ patient.name ? patient.name.slice(0, 1).toUpperCase() : 'P' }}</span><span class="profile-trigger-copy"><strong>{{ patient.name || 'Patient' }}</strong><small>Patient</small></span><ChevronDown :size="15" />
        </button>
        <div v-if="openMenu === 'profile'" class="top-popover profile-popover">
          <RouterLink to="/patient/profile" @click="openMenu = ''"><UserRound :size="16" /> My profile</RouterLink>
          <RouterLink to="/patient/settings" @click="openMenu = ''"><Settings :size="16" /> Settings</RouterLink>
          <button type="button" @click="openMenu = ''"><LogOut :size="16" /> Log out</button>
        </div>
      </div>
    </div>
  </header>
</template>

