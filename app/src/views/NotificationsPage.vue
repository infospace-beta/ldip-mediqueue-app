<script setup>
import { computed, ref } from "vue";
import {
  Bell,
  CalendarDays,
  CheckCheck,
  Clock3,
  Info,
  ShieldPlus,
} from "@lucide/vue";
import { notifications, unreadCount } from "../data/patient";

const filter = ref("All");
const filters = ["All", "Unread", "Queue", "Appointments"];
const visibleNotifications = computed(() =>
  notifications.filter((item) => {
    if (filter.value === "Unread") return item.unread;
    if (filter.value === "Queue") return item.kind === "queue";
    if (filter.value === "Appointments") return item.kind === "appointment";
    return true;
  }),
);
function markAllRead() {
  notifications.forEach((item) => {
    item.unread = false;
  });
}
function iconFor(kind) {
  return (
    {
      queue: Clock3,
      appointment: CalendarDays,
      emergency: ShieldPlus,
      hospital: Info,
    }[kind] || Bell
  );
}
</script>

<template>
  <div class="section-page notifications-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">CARE UPDATES</span>
        <h1>Notifications</h1>
        <p>
          Queue and appointment updates will appear here when notification
          services are connected.
        </p>
      </div>
      <button
        class="button button-secondary"
        type="button"
        :disabled="!unreadCount()"
        @click="markAllRead"
      >
        <CheckCheck :size="16" aria-hidden="true" /> Mark all as read
      </button>
    </div>
    <div class="notification-toolbar">
      <div class="filter-tabs" role="tablist" aria-label="Filter notifications">
        <button
          v-for="item in filters"
          :key="item"
          type="button"
          role="tab"
          :aria-selected="filter === item"
          :class="{ active: filter === item }"
          @click="filter = item"
        >
          {{ item
          }}<span v-if="item === 'Unread' && unreadCount()">{{
            unreadCount()
          }}</span>
        </button>
      </div>
      <span class="notification-result-count"
        >{{ visibleNotifications.length }}
        {{ visibleNotifications.length === 1 ? "item" : "items" }}</span
      >
    </div>
    <section v-if="visibleNotifications.length" class="notification-list panel">
      <article
        v-for="item in visibleNotifications"
        :key="item.id"
        class="notification-row"
        :class="{ 'notification-row-unread': item.unread }"
      >
        <span class="notification-type-icon" :class="`type-${item.kind}`"
          ><component :is="iconFor(item.kind)" :size="18" aria-hidden="true"
        /></span>
        <div class="notification-row-copy">
          <div class="notification-row-title">
            <strong>{{ item.title }}</strong
            ><span v-if="item.unread" class="unread-label">NEW</span>
          </div>
          <p>{{ item.message }}</p>
          <time>{{ item.time }}</time>
        </div>
        <span
          v-if="item.unread"
          class="unread-indicator"
          aria-label="Unread"
        ></span
        ><span v-else class="read-check" aria-label="Read"
          ><CheckCheck :size="17" aria-hidden="true"
        /></span>
      </article>
    </section>
    <section v-else class="panel empty-state">
      <span class="empty-state-icon"
        ><Bell :size="23" aria-hidden="true"
      /></span>
      <h2>
        {{
          filter === "All"
            ? "No notification data available"
            : `No ${filter.toLowerCase()} notifications`
        }}
      </h2>
      <p>
        There are no notifications in this browser session, and notification
        services are not connected.
      </p>
      <button
        v-if="filter !== 'All'"
        class="button button-secondary"
        type="button"
        @click="filter = 'All'"
      >
        Show all notifications
      </button>
    </section>
  </div>
</template>
