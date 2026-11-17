<script setup>
import { computed, onMounted, ref } from "vue";
import {
  Bell,
  CalendarDays,
  CheckCheck,
  Clock3,
  Info,
  ShieldPlus,
} from "@lucide/vue";
import { notifications, unreadCount } from "../data/patient";
import { mediqueueService } from "@/services/mediqueue.service";

const filter = ref("All");
const filters = ["All", "Unread", "Queue", "Appointments"];
const isLoading = ref(true);
const errorMessage = ref("");
const visibleNotifications = computed(() =>
  notifications.filter((item) => {
    if (filter.value === "Unread") return item.unread;
    if (filter.value === "Queue") return item.kind.toLowerCase().includes("queue");
    if (filter.value === "Appointments") return item.kind.toLowerCase().includes("appointment");
    return true;
  }),
);
async function loadNotifications() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const records = await mediqueueService.getNotifications();
    notifications.splice(
      0,
      notifications.length,
      ...records.map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        time: new Date(item.createdAt).toLocaleString(),
        kind: item.kind,
        unread: item.unread,
      })),
    );
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to load notifications.";
  } finally {
    isLoading.value = false;
  }
}
async function markAllRead() {
  errorMessage.value = "";
  try {
    await mediqueueService.markAllNotificationsRead();
    notifications.forEach((item) => {
      item.unread = false;
    });
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to update notifications.";
  }
}
async function markRead(item) {
  if (!item.unread) return;
  errorMessage.value = "";
  try {
    await mediqueueService.markNotificationRead(Number(item.id));
    item.unread = false;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to update notification.";
  }
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
onMounted(() => void loadNotifications());
</script>

<template>
  <div class="section-page notifications-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">CARE UPDATES</span>
        <h1>Notifications</h1>
        <p>
          Read updates from your MediQueue care activity.
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
    <p v-if="errorMessage" class="form-message form-error" role="alert">
      {{ errorMessage }}
      <button class="text-link" type="button" @click="loadNotifications">
        Retry
      </button>
    </p>
    <p v-if="isLoading" class="supporting-copy" role="status">
      Loading notifications…
    </p>
    <div v-else class="notification-toolbar">
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
        <button
          v-if="item.unread"
          class="button button-secondary button-small"
          type="button"
          @click="markRead(item)"
        >
          Mark read
        </button>
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
        New queue, appointment, or care updates will appear here.
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
