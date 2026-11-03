<script setup lang="ts">
import { Bell, Menu, Search, UserRound } from "@lucide/vue";
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";

defineProps<{
  title: string;
  doctorName: string;
  doctorRole: string;
  searchEnabled: boolean;
  searchAvailable: boolean;
  searchQuery: string;
  mobileNavigationOpen: boolean;
}>();

const emit = defineEmits<{
  "toggle-navigation": [];
  "update:searchQuery": [value: string];
  notifications: [];
  profile: [];
}>();
</script>

<template>
  <header class="doctor-topbar">
    <button
      class="doctor-icon-button doctor-menu-trigger"
      type="button"
      :aria-label="
        mobileNavigationOpen
          ? 'Close doctor navigation'
          : 'Open doctor navigation'
      "
      aria-controls="doctor-workspace-navigation"
      :aria-expanded="mobileNavigationOpen"
      @click="emit('toggle-navigation')"
    >
      <Menu :size="20" aria-hidden="true" />
    </button>
    <div class="doctor-topbar-heading">
      <span class="doctor-eyebrow">MEDIQUEUE / DOCTOR</span>
      <h1>{{ title }}</h1>
    </div>

    <label v-if="searchEnabled" class="doctor-search">
      <Search :size="17" aria-hidden="true" />
      <input
        :value="searchQuery"
        type="search"
        aria-label="Search appointments or patient records"
        placeholder="Available after backend integration"
        :disabled="!searchAvailable"
        @input="
          emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
      />
    </label>

    <div class="doctor-topbar-actions">
      <ThemeSwitcher />
      <button
        class="doctor-icon-button doctor-notification-button"
        type="button"
        aria-label="Open notifications"
        @click="emit('notifications')"
      >
        <Bell :size="19" aria-hidden="true" />
      </button>
      <button
        class="doctor-profile-trigger"
        type="button"
        aria-label="Open doctor profile"
        @click="emit('profile')"
      >
        <span class="doctor-avatar" aria-hidden="true">
          <UserRound :size="18" />
        </span>
        <span class="doctor-profile-copy">
          <strong>{{ doctorName }}</strong>
          <small>{{ doctorRole }}</small>
        </span>
      </button>
    </div>
  </header>
</template>
