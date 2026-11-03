<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Clock3,
  Info,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from "@lucide/vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import ThemeSwitcher from "./common/ThemeSwitcher.vue";
import LogoutAction from "./common/LogoutAction.vue";
import { notifications, patient, unreadCount } from "../data/patient";

const props = defineProps<{ title?: string; menuOpen?: boolean }>();
defineEmits<{ (event: "toggle-menu"): void }>();
const router = useRouter();
const topbar = ref<HTMLElement | null>(null);
const notificationTrigger = ref<HTMLButtonElement | null>(null);
const profileTrigger = ref<HTMLButtonElement | null>(null);
const search = ref("");
const searchMessage = ref("");
const openMenu = ref("");
const unread = computed(() => unreadCount());
const pageTitle = computed(() =>
  props.title === "Dashboard" ? "Patient Dashboard" : props.title,
);
onClickOutside(topbar, (event) => {
  if (
    event.target instanceof Element &&
    event.target.closest(".confirmation-backdrop")
  ) {
    return;
  }
  openMenu.value = "";
});

function searchSubmit() {
  const query = search.value.trim().toLowerCase();
  if (!query) return;

  const destination = query.includes("appointment")
    ? "/patient/appointments"
    : query.includes("emergency") || query.includes("urgent")
      ? "/patient/emergency"
      : query.includes("history") || query.includes("record")
        ? "/patient/history"
        : query.includes("notification") || query.includes("update")
          ? "/patient/notifications"
          : query.includes("profile") || query.includes("account")
            ? "/patient/profile"
            : query.includes("setting") || query.includes("preference")
              ? "/patient/settings"
              : query.includes("join") ||
                  query.includes("request") ||
                  query.includes("hospital") ||
                  query.includes("service")
                ? "/patient/join-queue"
                : query.includes("queue")
                  ? "/patient/queue"
                  : null;

  if (!destination) {
    searchMessage.value =
      "No patient page matches that search. Try queue, appointments, emergency information, profile, or settings.";
    return;
  }

  searchMessage.value = "";
  search.value = "";
  void router.push(destination);
}

function markRead(item: (typeof notifications)[number]) {
  item.unread = false;
  openMenu.value = "";
  router.push("/patient/notifications");
}

function closePopover() {
  const previousMenu = openMenu.value;
  openMenu.value = "";
  if (previousMenu === "notifications") {
    notificationTrigger.value?.focus();
  } else if (previousMenu === "profile") {
    profileTrigger.value?.focus();
  }
}
</script>

<template>
  <header ref="topbar" class="topbar" @keydown.esc.prevent.stop="closePopover">
    <button
      class="icon-button mobile-menu-trigger"
      type="button"
      :aria-label="props.menuOpen ? 'Close navigation' : 'Open navigation'"
      aria-controls="patient-sidebar"
      :aria-expanded="props.menuOpen"
      @click="$emit('toggle-menu')"
    >
      <Menu :size="21" aria-hidden="true" />
    </button>
    <div class="topbar-heading">
      <p class="greeting">{{ pageTitle || "Patient Dashboard" }}</p>
      <p class="topbar-date">Welcome back, {{ patient.name || "Patient" }}</p>
    </div>
    <form class="search-box" @submit.prevent="searchSubmit">
      <Search :size="17" aria-hidden="true" /><label
        class="sr-only"
        for="patient-page-search"
        >Navigate to a patient page</label
      ><input
        id="patient-page-search"
        v-model="search"
        type="search"
        :aria-describedby="
          searchMessage ? 'patient-page-search-status' : undefined
        "
        placeholder="Queue, appointments, profile..."
        @input="searchMessage = ''"
      />
    </form>
    <p
      v-if="searchMessage"
      id="patient-page-search-status"
      class="sr-only"
      role="status"
    >
      {{ searchMessage }}
    </p>
    <div class="topbar-actions">
      <ThemeSwitcher />
      <div class="popover-anchor">
        <button
          ref="notificationTrigger"
          class="icon-button notification-trigger"
          type="button"
          :aria-label="
            unread ? `Notifications, ${unread} unread` : 'Notifications'
          "
          :aria-expanded="openMenu === 'notifications'"
          aria-controls="patient-notification-popover"
          @click="
            openMenu = openMenu === 'notifications' ? '' : 'notifications'
          "
        >
          <Bell :size="19" /><span v-if="unread" class="notification-dot">{{
            unread
          }}</span>
        </button>
        <div
          v-if="openMenu === 'notifications'"
          id="patient-notification-popover"
          class="top-popover notification-popover"
        >
          <div class="popover-heading">
            <strong>Notifications</strong
            ><RouterLink to="/patient/notifications" @click="openMenu = ''"
              >View all</RouterLink
            >
          </div>
          <button
            v-for="item in notifications.slice(0, 3)"
            :key="item.id"
            class="popover-notification"
            :class="{ 'popover-unread': item.unread }"
            type="button"
            @click="markRead(item)"
          >
            <span class="notification-marker" :class="`marker-${item.kind}`"
              ><Clock3 v-if="item.kind === 'queue'" :size="15" /><CalendarDays
                v-else-if="item.kind === 'appointment'"
                :size="15" /><Info v-else :size="15"
            /></span>
            <span
              ><strong>{{ item.title }}</strong
              ><small>{{ item.message }}</small
              ><time>{{ item.time }}</time></span
            >
          </button>
          <p v-if="!notifications.length" class="popover-empty">
            Notification data is unavailable in this browser session.
          </p>
        </div>
      </div>
      <div class="popover-anchor profile-anchor">
        <button
          ref="profileTrigger"
          class="profile-trigger"
          type="button"
          :aria-expanded="openMenu === 'profile'"
          aria-controls="patient-profile-popover"
          @click="openMenu = openMenu === 'profile' ? '' : 'profile'"
        >
          <span class="avatar avatar-small">{{
            patient.name ? patient.name.slice(0, 1).toUpperCase() : "P"
          }}</span
          ><span class="profile-trigger-copy"
            ><strong>{{ patient.name || "Patient" }}</strong
            ><small>Patient</small></span
          ><ChevronDown :size="15" />
        </button>
        <div
          v-if="openMenu === 'profile'"
          id="patient-profile-popover"
          class="top-popover profile-popover"
        >
          <RouterLink to="/patient/profile" @click="openMenu = ''"
            ><UserRound :size="16" /> My profile</RouterLink
          >
          <RouterLink to="/patient/settings" @click="openMenu = ''"
            ><Settings :size="16" /> Settings</RouterLink
          >
          <LogoutAction button-class="top-popover-action">
            <LogOut :size="16" /> Log out
          </LogoutAction>
        </div>
      </div>
    </div>
  </header>
</template>
