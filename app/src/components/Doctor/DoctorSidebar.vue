<script setup lang="ts">
import {
  Bell,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
  UsersRound,
  X,
} from "@lucide/vue";
import type { Component } from "vue";
import LogoutAction from "@/components/common/LogoutAction.vue";

export type DoctorSection =
  | "overview"
  | "appointments"
  | "patients"
  | "notifications"
  | "profile"
  | "settings";

const props = defineProps<{
  activeSection: DoctorSection;
  mobileOpen: boolean;
  mobileViewport: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: DoctorSection];
  close: [];
}>();

const navigation: {
  id: DoctorSection;
  label: string;
  icon: Component;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "patients", label: "Patient directory", icon: UsersRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Doctor profile", icon: UserRound },
  { id: "settings", label: "Settings", icon: Settings },
];
</script>

<template>
  <button
    v-if="mobileOpen"
    class="doctor-scrim"
    type="button"
    aria-label="Close doctor navigation"
    tabindex="-1"
    @click="emit('close')"
  />
  <aside
    id="doctor-workspace-navigation"
    class="doctor-sidebar"
    :class="{ 'is-open': props.mobileOpen }"
    :inert="props.mobileViewport && !props.mobileOpen ? true : undefined"
    aria-label="Doctor workspace navigation"
  >
    <div class="doctor-brand">
      <span class="doctor-brand-mark">
        <img :src="'/mediqueue-logo.png'" alt="" />
      </span>
      <span>
        <strong>MediQueue</strong>
        <small>DOCTOR WORKSPACE</small>
      </span>
      <button
        class="doctor-icon-button doctor-sidebar-close"
        type="button"
        aria-label="Close navigation"
        @click="emit('close')"
      >
        <X :size="19" />
      </button>
    </div>

    <p class="doctor-nav-label">WORKSPACE</p>
    <nav class="doctor-navigation" aria-label="Doctor workspace">
      <button
        v-for="item in navigation"
        :key="item.id"
        class="doctor-nav-link"
        :class="{ 'is-active': activeSection === item.id }"
        :aria-current="activeSection === item.id ? 'page' : undefined"
        type="button"
        @click="emit('navigate', item.id)"
      >
        <component :is="item.icon" :size="18" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="doctor-sidebar-note">
      <span class="doctor-integration-dot" aria-hidden="true" />
      <span>
        <strong>Hospital services connected</strong>
        <small>Live clinical workflows available</small>
      </span>
    </div>
    <LogoutAction
      button-class="doctor-nav-link doctor-logout"
      @logout="emit('close')"
    >
      <LogOut :size="18" aria-hidden="true" />
      <span>Log out</span>
    </LogoutAction>
  </aside>
</template>
