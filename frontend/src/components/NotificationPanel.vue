<script setup lang="ts">
import type { NotificationItem } from '../types'

defineProps<{
  notifications: NotificationItem[]
}>()
</script>

<template>
  <aside class="notification-panel panel">
    <div class="panel__header">
      <div>
        <p class="eyebrow">Notifications</p>
        <h3>Recent updates</h3>
      </div>
    </div>

    <div v-if="notifications.length === 0" class="empty-state empty-state--small">
      <p>No active notifications.</p>
    </div>

    <ul v-else class="notification-list">
      <li v-for="item in notifications" :key="item.id" class="notification-item" :class="`notification-item--${item.type}`">
        <div class="notification-item__icon" aria-hidden="true">•</div>
        <div>
          <strong>{{ item.title }}</strong>
          <p>{{ item.detail }}</p>
          <span>{{ item.time }}</span>
        </div>
      </li>
    </ul>
  </aside>
</template>
