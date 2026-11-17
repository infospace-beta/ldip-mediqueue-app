<script setup>
import { useRoute } from "vue-router";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldPlus,
  UserRound,
  UsersRound,
  X,
} from "@lucide/vue";
import LogoutAction from "./common/LogoutAction.vue";

defineProps({ open: Boolean });
const emit = defineEmits(["close"]);
const route = useRoute();
const primary = [
  { label: "Dashboard", to: "/patient/dashboard", icon: LayoutDashboard },
  {
    label: "Prepare queue request",
    to: "/patient/join-queue",
    icon: UsersRound,
  },
  { label: "My queue", to: "/patient/queue", icon: Clock3 },
  { label: "Emergency", to: "/patient/emergency", icon: ShieldPlus },
  { label: "Appointments", to: "/patient/appointments", icon: CalendarDays },
];
const care = [
  { label: "Notifications", to: "/patient/notifications", icon: Activity },
  { label: "Medical history", to: "/patient/history", icon: ClipboardList },
  { label: "My profile", to: "/patient/profile", icon: UserRound },
  { label: "Settings", to: "/patient/settings", icon: Settings },
];
function isActive(item) {
  return route.path === item.to;
}
</script>

<template>
  <div
    v-if="open"
    class="mobile-scrim"
    aria-hidden="true"
    @click="emit('close')"
  ></div>
  <aside
    id="patient-sidebar"
    class="sidebar"
    :class="{ 'sidebar-open': open }"
    aria-label="Patient navigation"
  >
    <div class="brand-row">
      <RouterLink class="brand" to="/patient/dashboard" @click="emit('close')">
        <img class="brand-mark brand-image" src="/mediqueue-logo.png" alt="" />
        <span class="brand-copy"
          ><strong>MEDIQUEUE</strong><small>PATIENT CARE PORTAL</small></span
        >
      </RouterLink>
      <button
        class="icon-button sidebar-close"
        type="button"
        aria-label="Close navigation"
        @click="emit('close')"
      >
        <X :size="19" aria-hidden="true" />
      </button>
    </div>

    <div class="sidebar-label">PATIENT PORTAL</div>
    <nav class="sidebar-nav" aria-label="Patient dashboard">
      <RouterLink
        v-for="item in primary"
        :key="item.label"
        :to="item.to"
        class="nav-link"
        :class="{ active: isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
        @click="emit('close')"
      >
        <span class="nav-icon"
          ><component
            :is="item.icon"
            :size="18"
            :stroke-width="1.8"
            aria-hidden="true" /></span
        ><span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-label sidebar-label-spaced">YOUR CARE</div>
    <nav class="sidebar-nav" aria-label="Patient account">
      <RouterLink
        v-for="item in care"
        :key="item.label"
        :to="item.to"
        class="nav-link"
        :class="{ active: isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
        @click="emit('close')"
      >
        <span class="nav-icon"
          ><component
            :is="item.icon"
            :size="18"
            :stroke-width="1.8"
            aria-hidden="true" /></span
        ><span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-bottom">
      <div class="help-card">
        <span class="help-icon"
          ><Activity :size="17" aria-hidden="true"
        /></span>
        <strong>Need a hand?</strong>
        <span class="help-contact-note"
          >Support information will appear here when available.</span
        >
      </div>
      <LogoutAction button-class="nav-link logout-link" @logout="emit('close')"
        ><span class="nav-icon"><LogOut :size="18" aria-hidden="true" /></span
        ><span class="nav-label">Log out</span></LogoutAction
      >
      <div class="sidebar-version">MediQueue <span>Patient portal</span></div>
    </div>
  </aside>
</template>
