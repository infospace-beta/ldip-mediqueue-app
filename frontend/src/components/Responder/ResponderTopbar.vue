<script setup>
import { computed, ref } from 'vue'
import { Bell, Menu, Search } from '@lucide/vue'
import ThemeToggle from './ThemeToggle.vue'
defineProps({ title: String, dark: Boolean, notificationCount: Number })
defineEmits(['toggle-menu', 'toggle-theme'])
const notificationsOpen = ref(false)
const notificationLabel = computed(() => notificationsOpen.value ? 'Close notifications' : 'Open notifications')
const availability = ref('Available')
</script>

<template>
  <header class="responder-topbar">
    <button class="responder-icon-button responder-menu-button" type="button" aria-label="Open navigation" @click="$emit('toggle-menu')"><Menu :size="20" /></button>
    <div class="responder-page-title"><span class="responder-eyebrow">MEDIQUEUE / RESPONSE</span><h1>{{ title }}</h1></div>
    <label class="responder-search"><Search :size="17" /><input aria-label="Search dashboard" type="search" placeholder="Search requests, patients..." /></label>
    <div class="responder-topbar-actions">
      <div class="responder-notification-anchor">
        <button class="responder-icon-button responder-notification-button" type="button" :aria-label="notificationLabel" :aria-expanded="notificationsOpen" @click="notificationsOpen = !notificationsOpen"><Bell :size="18" /><span class="responder-notification-count">{{ notificationCount }}</span></button>
        <section v-if="notificationsOpen" class="responder-notification-popover" aria-label="Notifications"><div class="responder-popover-heading"><strong>Notifications</strong><span>{{ notificationCount }}</span></div><p>No new notifications</p></section>
      </div>
      <ThemeToggle :dark="dark" @toggle="$emit('toggle-theme')" />
      <label class="responder-availability-select"><span class="responder-availability-dot"></span><select v-model="availability" aria-label="Responder availability"><option>Available</option><option>Busy</option><option>Offline</option></select></label>
      <div class="responder-user"><span class="responder-avatar" aria-hidden="true">R</span><span><strong>Responder</strong><small>Emergency response</small></span></div>
    </div>
  </header>
</template>