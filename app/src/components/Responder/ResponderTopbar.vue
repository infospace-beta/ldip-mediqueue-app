<script setup lang="ts">
import { computed, ref } from "vue";
import { Bell, Menu, Search, X } from "@lucide/vue";
import ThemeSwitcher from "../common/ThemeSwitcher.vue";
const props = defineProps<{
  title: string;
  searchable: boolean;
  mobileNavigationOpen: boolean;
}>();
const emit = defineEmits<{
  "toggle-menu": [];
  search: [value: string];
}>();
const notificationsOpen = ref(false);
const notificationLabel = computed(() =>
  notificationsOpen.value ? "Close notifications" : "Open notifications",
);
const menuLabel = computed(() =>
  props.mobileNavigationOpen ? "Close navigation" : "Open navigation",
);
function updateSearch(event: Event) {
  emit("search", (event.currentTarget as HTMLInputElement).value);
}
</script>

<template>
  <header class="responder-topbar">
    <button
      class="responder-icon-button responder-menu-button"
      type="button"
      :aria-label="menuLabel"
      aria-controls="responder-navigation"
      :aria-expanded="mobileNavigationOpen"
      @click="emit('toggle-menu')"
    >
      <X v-if="mobileNavigationOpen" :size="20" aria-hidden="true" />
      <Menu v-else :size="20" aria-hidden="true" />
    </button>
    <div class="responder-page-title">
      <span class="responder-eyebrow">MEDIQUEUE / RESPONSE</span>
      <h1>{{ props.title }}</h1>
    </div>
    <label v-if="props.searchable" class="responder-search"
      ><Search :size="17" aria-hidden="true" /><input
        aria-label="Search local responder records"
        type="search"
        placeholder="Search session records"
        @input="updateSearch"
    /></label>
    <div class="responder-topbar-actions">
      <div class="responder-notification-anchor">
        <button
          class="responder-icon-button responder-notification-button"
          type="button"
          :aria-label="notificationLabel"
          :aria-expanded="notificationsOpen"
          @click="notificationsOpen = !notificationsOpen"
        >
          <Bell :size="18" />
        </button>
        <section
          v-if="notificationsOpen"
          class="responder-notification-popover"
          aria-label="Notifications"
        >
          <div class="responder-popover-heading">
            <strong>Notifications</strong>
          </div>
          <p>
            Notification data is unavailable because the responder service is
            not connected.
          </p>
        </section>
      </div>
      <ThemeSwitcher />
      <span class="responder-workspace-label">Response workspace</span>
    </div>
  </header>
</template>
