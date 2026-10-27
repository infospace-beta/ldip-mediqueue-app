<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bell, Menu, Search } from '@lucide/vue'
import ThemeToggle from './ThemeToggle.vue'
defineProps({ title: String, dark: Boolean, searchable: Boolean })
const emit = defineEmits(['toggle-menu', 'toggle-theme', 'search'])
const notificationsOpen = ref(false)
const notificationLabel = computed(() => notificationsOpen.value ? 'Close notifications' : 'Open notifications')
function updateSearch(event: Event) {
  emit('search', (event.currentTarget as HTMLInputElement).value)
}
</script>

<template>
  <header class="responder-topbar">
    <button class="responder-icon-button responder-menu-button" type="button" aria-label="Open navigation" @click="$emit('toggle-menu')"><Menu :size="20" /></button>
    <div class="responder-page-title"><span class="responder-eyebrow">MEDIQUEUE / RESPONSE</span><h1>{{ title }}</h1></div>
    <label v-if="searchable" class="responder-search"><Search :size="17" aria-hidden="true" /><input aria-label="Search local responder records" type="search" placeholder="Search session records" @input="updateSearch" /></label>
    <div class="responder-topbar-actions">
      <div class="responder-notification-anchor">
        <button class="responder-icon-button responder-notification-button" type="button" :aria-label="notificationLabel" :aria-expanded="notificationsOpen" @click="notificationsOpen = !notificationsOpen"><Bell :size="18" /></button>
        <section v-if="notificationsOpen" class="responder-notification-popover" aria-label="Notifications"><div class="responder-popover-heading"><strong>Notifications</strong></div><p>Notification data is unavailable because the responder service is not connected.</p></section>
      </div>
      <ThemeToggle :dark="dark" @toggle="$emit('toggle-theme')" />
      <span class="responder-workspace-label">Response workspace</span>
    </div>
  </header>
</template>
