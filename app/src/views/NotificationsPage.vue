<script setup>
import { computed, ref } from 'vue'
import { Bell, CalendarDays, CheckCheck, Clock3, Info, ShieldPlus } from '@lucide/vue'
import { notifications, unreadCount } from '../data/patient'

const filter = ref('All')
const filters = ['All', 'Unread', 'Queue', 'Appointments']
const visibleNotifications = computed(() => notifications.filter((item) => {
  if (filter.value === 'Unread') return item.unread
  if (filter.value === 'Queue') return item.kind === 'queue'
  if (filter.value === 'Appointments') return item.kind === 'appointment'
  return true
}))
function markAllRead() {
  notifications.forEach((item) => { item.unread = false })
}
function iconFor(kind) {
  return { queue: Clock3, appointment: CalendarDays, emergency: ShieldPlus, hospital: Info }[kind] || Bell
}
</script>

<template>
  <div class="section-page"><div class="page-heading"><div><span class="eyebrow">STAY IN THE LOOP</span><h1>Notifications <span class="heading-count">{{ notifications.length }}</span></h1><p>Notifications: {{ notifications.length }}</p></div><button class="button button-secondary" type="button" :disabled="!unreadCount()" @click="markAllRead"><CheckCheck :size="16" /> Mark all as read</button></div>
    <div class="notification-toolbar"><div class="filter-tabs" role="tablist" aria-label="Filter notifications"><button v-for="item in filters" :key="item" type="button" role="tab" :aria-selected="filter === item" :class="{ active: filter === item }" @click="filter = item">{{ item }}<span v-if="item === 'Unread' && unreadCount()">{{ unreadCount() }}</span></button></div><span>{{ visibleNotifications.length }} updates</span></div>
    <section v-if="visibleNotifications.length" class="notification-list panel"><article v-for="item in visibleNotifications" :key="item.id" class="notification-row" :class="{ 'notification-row-unread': item.unread }"><span class="notification-type-icon" :class="`type-${item.kind}`"><component :is="iconFor(item.kind)" :size="18" /></span><div class="notification-row-copy"><div class="notification-row-title"><strong>{{ item.title }}</strong><span v-if="item.unread" class="unread-label">NEW</span></div><p>{{ item.message }}</p><time>{{ item.time }}</time></div><span v-if="item.unread" class="unread-indicator" aria-label="Unread"></span><button v-else class="read-check" type="button" aria-label="Read"><CheckCheck :size="17" /></button></article></section>
    <section v-else class="panel empty-state"><span class="empty-state-icon"><Bell :size="23" /></span><h2>No new notifications</h2><p>New updates will appear here when notification data is available.</p><button v-if="filter !== 'All'" class="button button-secondary" type="button" @click="filter = 'All'">Show all notifications</button></section>
  </div>
</template>

