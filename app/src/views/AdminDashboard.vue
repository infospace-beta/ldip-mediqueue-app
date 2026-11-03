<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Stethoscope,
  UsersRound,
} from "@lucide/vue";
import type { Component } from "vue";
import LogoutAction from "@/components/common/LogoutAction.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useMobileNavigation } from "@/composables/useMobileNavigation";
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";
import StateEmpty from "@/components/ui/StateEmpty.vue";
import HospitalManagement from "@/components/Admin/HospitalManagement.vue";
import "@/assets/admin.css";

type AdminSection =
  | "overview"
  | "users"
  | "hospitals"
  | "departments"
  | "medical-staff"
  | "appointments"
  | "queues"
  | "emergencies"
  | "settings";

interface AdminNavigationItem {
  id: AdminSection;
  label: string;
  icon: Component;
}

interface AdminDataSection {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: Component;
}

const navigation: AdminNavigationItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: UsersRound },
  { id: "hospitals", label: "Hospital Management", icon: Building2 },
  { id: "departments", label: "Department Management", icon: Building2 },
  { id: "medical-staff", label: "Medical Staff", icon: Stethoscope },
  { id: "appointments", label: "Appointment Oversight", icon: CalendarDays },
  { id: "queues", label: "Queue Oversight", icon: ClipboardList },
  { id: "emergencies", label: "Emergency Oversight", icon: ShieldAlert },
  { id: "settings", label: "System Settings", icon: Settings },
];

const sections: Record<Exclude<AdminSection, "overview">, AdminDataSection> = {
  users: {
    eyebrow: "ACCESS & ACCOUNTS",
    title: "User Management",
    description:
      "Review user records and account access through the authorized administration service when it is connected.",
    emptyTitle: "User data unavailable",
    emptyDescription:
      "User records will appear here when the administration service is connected.",
    icon: UsersRound,
  },
  hospitals: {
    eyebrow: "ORGANIZATION",
    title: "Hospital Management",
    description:
      "Prepare hospital details in this workspace. Verified hospital records and registration require the connected hospital service.",
    emptyTitle: "Hospital data unavailable",
    emptyDescription:
      "Hospital records will appear here when the hospital management service is connected.",
    icon: Building2,
  },
  departments: {
    eyebrow: "ORGANIZATION",
    title: "Department Management",
    description:
      "Department records and service configuration require connected, authorized hospital data.",
    emptyTitle: "Department data unavailable",
    emptyDescription:
      "Department records will appear here when the administration service is connected.",
    icon: Building2,
  },
  "medical-staff": {
    eyebrow: "CARE TEAMS",
    title: "Medical Staff",
    description:
      "Review staff rosters and hospital membership after the authorized administration service is connected.",
    emptyTitle: "Medical staff data unavailable",
    emptyDescription:
      "Staff records will appear here when the administration service is connected.",
    icon: Stethoscope,
  },
  appointments: {
    eyebrow: "SCHEDULING",
    title: "Appointment Oversight",
    description:
      "Appointment oversight depends on records supplied by the authorized scheduling service.",
    emptyTitle: "Appointment data unavailable",
    emptyDescription:
      "Appointment records will appear here when the scheduling service is connected.",
    icon: CalendarDays,
  },
  queues: {
    eyebrow: "PATIENT FLOW",
    title: "Queue Oversight",
    description:
      "Review hospital queue activity when the authorized queue service supplies live records.",
    emptyTitle: "Queue data unavailable",
    emptyDescription:
      "Queue records will appear here when the queue service is connected.",
    icon: ClipboardList,
  },
  emergencies: {
    eyebrow: "EMERGENCY SERVICES",
    title: "Emergency Oversight",
    description:
      "Emergency activity is unavailable until an authorized emergency service supplies records. This workspace does not dispatch requests.",
    emptyTitle: "Emergency data unavailable",
    emptyDescription:
      "Emergency records will appear here when the emergency service is connected.",
    icon: ShieldAlert,
  },
  settings: {
    eyebrow: "CONFIGURATION",
    title: "System Settings",
    description:
      "System configuration can be reviewed only through a connected, authorized administration service.",
    emptyTitle: "System settings unavailable",
    emptyDescription:
      "Configuration options will appear here when the administration service is connected.",
    icon: Settings,
  },
};

const auth = useAuthStore();
const activeSection = ref<AdminSection>("overview");
const {
  isMobile: mobileViewport,
  isOpen: mobileNavigationOpen,
  root: mobileNavigationRoot,
  toggle: toggleMobileNavigation,
  close: closeMobileNavigation,
} = useMobileNavigation({
  breakpoint: 800,
  trigger: ".admin-menu-button",
  firstNavigationItem: ".admin-navigation .admin-nav-link",
});

function setNavigationRoot(element: unknown) {
  mobileNavigationRoot.value = element instanceof HTMLElement ? element : null;
}

const activeNavigationItem = computed(() =>
  navigation.find((item) => item.id === activeSection.value)!,
);
const currentSection = computed(() =>
  activeSection.value === "overview" ? null : sections[activeSection.value],
);
const administratorName = computed(
  () => auth.user?.username?.trim() || "Profile information unavailable.",
);
const administratorInitial = computed(
  () => auth.user?.username?.trim().charAt(0).toUpperCase() || "?",
);

function navigateTo(section: AdminSection) {
  activeSection.value = section;
  void closeMobileNavigation();
}
</script>

<template>
  <div :ref="setNavigationRoot" class="admin-dashboard">
    <a class="admin-skip-link" href="#admin-main-content">
      Skip to main content
    </a>

    <button
      v-if="mobileNavigationOpen"
      class="admin-scrim"
      type="button"
      aria-label="Close admin navigation"
      tabindex="-1"
      @click="closeMobileNavigation"
    />

    <aside
      id="admin-navigation"
      class="admin-sidebar"
      :class="{ 'admin-sidebar-open': mobileNavigationOpen }"
      :inert="mobileViewport && !mobileNavigationOpen ? true : undefined"
      aria-label="Admin workspace navigation"
    >
      <div class="admin-brand">
        <span class="admin-brand-mark">
          <img :src="'/mediqueue-logo.png'" alt="" />
        </span>
        <span class="admin-brand-copy">
          <strong>MediQueue</strong>
          <small>ADMINISTRATION</small>
        </span>
      </div>

      <p class="admin-nav-label">WORKSPACE</p>
      <nav class="admin-navigation" aria-label="Admin workspace">
        <button
          v-for="item in navigation"
          :key="item.id"
          class="admin-nav-link"
          :class="{ 'admin-nav-link-active': activeSection === item.id }"
          :aria-current="activeSection === item.id ? 'page' : undefined"
          type="button"
          @click="navigateTo(item.id)"
        >
          <component :is="item.icon" :size="18" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="admin-connection-note" role="status">
        <span class="admin-connection-mark" aria-hidden="true" />
        <span>
          <strong>Administration data</strong>
          <small>Service not connected</small>
        </span>
      </div>

      <LogoutAction button-class="admin-nav-link admin-logout">
        <LogOut :size="18" aria-hidden="true" />
        <span>Log out</span>
      </LogoutAction>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <button
          class="admin-menu-button"
          type="button"
          :aria-expanded="mobileNavigationOpen"
          aria-controls="admin-navigation"
          :aria-label="
            mobileNavigationOpen ? 'Close navigation' : 'Open navigation'
          "
          @click="toggleMobileNavigation"
        >
          <span aria-hidden="true">{{
            mobileNavigationOpen ? "×" : "☰"
          }}</span>
        </button>

        <div class="admin-topbar-heading">
          <span class="admin-eyebrow">MEDIQUEUE / ADMIN</span>
          <h1>{{ activeNavigationItem.label }}</h1>
        </div>

        <div class="admin-topbar-actions">
          <ThemeSwitcher />
          <div class="admin-account" aria-label="Signed-in administrator">
            <span class="admin-account-mark" aria-hidden="true">
              {{ administratorInitial }}
            </span>
            <span>
              <strong>{{ administratorName }}</strong>
              <small>Administrator</small>
            </span>
          </div>
        </div>
      </header>

      <main id="admin-main-content" class="admin-content">
        <section class="admin-integration-banner" role="note">
          <span class="admin-banner-mark" aria-hidden="true">i</span>
          <p>
            <strong>Administration service not connected.</strong>
            Operational information and management actions are unavailable until
            a verified service is connected.
          </p>
        </section>

        <template v-if="activeSection === 'overview'">
          <section class="admin-page-heading">
            <div>
              <span class="admin-eyebrow">ADMINISTRATION WORKSPACE</span>
              <h2>Hospital administration overview</h2>
              <p>
                Hospital directory details can be prepared here. User,
                department, staffing, scheduling, and operational records
                require connected, authorized services.
              </p>
            </div>
            <span class="admin-availability-badge">Awaiting integration</span>
          </section>

          <section
            class="admin-overview-panel"
            aria-labelledby="admin-status-title"
          >
            <div class="admin-section-heading">
              <div>
                <span class="admin-eyebrow">SERVICE STATUS</span>
                <h2 id="admin-status-title">Administrative data</h2>
              </div>
              <span class="admin-unavailable-badge">Unavailable</span>
            </div>
            <StateEmpty
              title="No administrative data available"
              description="User, department, staff, appointment, queue, and emergency information will appear when their authorized services are connected."
            />
          </section>
        </template>

        <HospitalManagement v-else-if="activeSection === 'hospitals'" />

        <template v-else-if="currentSection">
          <section class="admin-page-heading">
            <div>
              <span class="admin-eyebrow">{{ currentSection.eyebrow }}</span>
              <h2>{{ currentSection.title }}</h2>
              <p>{{ currentSection.description }}</p>
            </div>
            <span class="admin-availability-badge">Awaiting integration</span>
          </section>

          <section
            class="admin-overview-panel"
            :aria-label="currentSection.title"
          >
            <div class="admin-section-heading">
              <div class="admin-section-title">
                <span class="admin-section-icon" aria-hidden="true">
                  <component :is="currentSection.icon" :size="19" />
                </span>
                <div>
                  <span class="admin-eyebrow">ADMIN WORKSPACE</span>
                  <h2>{{ currentSection.title }}</h2>
                </div>
              </div>
              <span class="admin-unavailable-badge">Unavailable</span>
            </div>
            <StateEmpty
              :title="currentSection.emptyTitle"
              :description="currentSection.emptyDescription"
            />
          </section>
        </template>

        <footer class="admin-footer">
          <span>MediQueue · Admin workspace</span>
          <span>Operational services unavailable</span>
        </footer>
      </main>
    </div>
  </div>
</template>
