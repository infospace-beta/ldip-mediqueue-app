<script setup lang="ts">
import { ref, type Component } from 'vue'
import {
  Activity,
  Building2,
  CalendarDays,
  Clock3,
  LayoutDashboard,
  Menu,
  ShieldAlert,
  UsersRound,
  X,
} from '@lucide/vue'
import '../assets/staff.css'

interface StaffSection {
  id: string
  label: string
  title: string
  description: string
  icon: Component
}

const navigation: StaffSection[] = [
  {
    id: 'operations',
    label: 'Operations overview',
    title: 'Hospital operations',
    description:
      'Operational summaries will be available when an authorized hospital service is connected.',
    icon: Activity,
  },
  {
    id: 'queue',
    label: 'Queue monitoring',
    title: 'Queue monitoring',
    description:
      'Queue records and status are unavailable. No live queue activity is shown in this preview.',
    icon: Clock3,
  },
  {
    id: 'patient-flow',
    label: 'Appointments & patient flow',
    title: 'Appointments and patient flow',
    description:
      'Appointment schedules and patient-flow information are unavailable until a verified service is connected.',
    icon: CalendarDays,
  },
  {
    id: 'departments',
    label: 'Staff & departments',
    title: 'Staff and departments',
    description:
      'Staff rosters and department information are unavailable. No membership or staffing details are assumed.',
    icon: UsersRound,
  },
  {
    id: 'emergency',
    label: 'Emergency activity',
    title: 'Emergency activity',
    description:
      'Emergency activity is unavailable. This dashboard does not receive or dispatch emergency requests.',
    icon: ShieldAlert,
  },
]

const mobileNavigationOpen = ref(false)
const activeSectionId = ref('operations')

function closeMobileNavigation() {
  mobileNavigationOpen.value = false
}
</script>

<template>
  <div class="staff-dashboard">
    <button
      v-if="mobileNavigationOpen"
      class="staff-scrim"
      type="button"
      aria-label="Close staff navigation"
      @click="closeMobileNavigation"
    />

    <aside
      class="staff-sidebar"
      :class="{ 'staff-sidebar-open': mobileNavigationOpen }"
      aria-label="Hospital staff navigation"
    >
      <a class="staff-brand" href="#operations" @click="closeMobileNavigation">
        <span class="staff-brand-mark" aria-hidden="true"><Building2 :size="21" /></span>
        <span class="staff-brand-copy">
          <strong>MediQueue</strong>
          <small>HOSPITAL OPERATIONS</small>
        </span>
      </a>

      <p class="staff-nav-heading">WORKSPACE</p>
      <nav id="staff-navigation" class="staff-navigation" aria-label="Staff workspace">
        <a
          v-for="(section, index) in navigation"
          :key="section.id"
          class="staff-nav-link"
          :class="{ 'staff-nav-link-active': activeSectionId === section.id }"
          :aria-current="activeSectionId === section.id ? 'location' : undefined"
          :href="`#${section.id}`"
          @click="activeSectionId = section.id; closeMobileNavigation()"
        >
          <component :is="index === 0 ? LayoutDashboard : section.icon" :size="18" aria-hidden="true" />
          <span>{{ section.label }}</span>
        </a>
      </nav>

      <div class="staff-sidebar-note" role="status">
        <span class="staff-connection-mark" aria-hidden="true"></span>
        <span>
          <strong>Data connection</strong>
          <small>Not configured</small>
        </span>
      </div>
    </aside>

    <div class="staff-main">
      <header class="staff-topbar">
        <div class="staff-topbar-heading">
          <span class="staff-eyebrow">MEDIQUEUE / STAFF</span>
          <h1>Hospital operations</h1>
        </div>
        <button
          class="staff-menu-button"
          type="button"
          :aria-expanded="mobileNavigationOpen"
          aria-controls="staff-navigation"
          :aria-label="mobileNavigationOpen ? 'Close navigation' : 'Open navigation'"
          @click="mobileNavigationOpen = !mobileNavigationOpen"
        >
          <X v-if="mobileNavigationOpen" :size="20" aria-hidden="true" />
          <Menu v-else :size="20" aria-hidden="true" />
        </button>
      </header>

      <main class="staff-content">
        <section class="staff-intro" aria-labelledby="staff-page-title">
          <div>
            <span class="staff-eyebrow">STAFF WORKSPACE</span>
            <h2 id="staff-page-title">Hospital operations overview</h2>
            <p>
              A workspace for queue, patient-flow, department, and emergency
              information.
            </p>
          </div>
          <span class="staff-preview-badge">Preview · No live data</span>
        </section>

        <section class="staff-connection-alert" role="status" aria-live="polite">
          <span class="staff-alert-icon" aria-hidden="true"><Activity :size="19" /></span>
          <div>
            <strong>Hospital services are not connected</strong>
            <p>
              Dashboard data is unavailable. This preview contains no live
              hospital records or operational controls.
            </p>
          </div>
        </section>

        <section id="operations" class="staff-section staff-overview-section" aria-labelledby="operations-title">
          <div class="staff-section-heading">
            <div>
              <span class="staff-eyebrow">OVERVIEW</span>
              <h2 id="operations-title">Operations at a glance</h2>
            </div>
            <span class="staff-unavailable-label">Unavailable</span>
          </div>
          <p class="staff-section-description">
            Hospital-wide operational summaries will appear here when a
            verified data service is available.
          </p>
          <div class="staff-overview-placeholder" role="status">
            <Activity :size="20" aria-hidden="true" />
            <span>
              <strong>No operational data available</strong>
              <small>This is an unavailable state, not a report of zero activity.</small>
            </span>
          </div>
        </section>

        <div class="staff-section-grid">
          <section
            v-for="section in navigation.slice(1)"
            :id="section.id"
            :key="section.id"
            class="staff-section staff-detail-section"
            :aria-labelledby="`${section.id}-title`"
          >
            <div class="staff-section-heading">
              <div class="staff-title-with-icon">
                <span class="staff-section-icon" aria-hidden="true">
                  <component :is="section.icon" :size="18" />
                </span>
                <div>
                  <span class="staff-eyebrow">STAFF WORKSPACE</span>
                  <h2 :id="`${section.id}-title`">{{ section.title }}</h2>
                </div>
              </div>
              <span class="staff-unavailable-label">Unavailable</span>
            </div>
            <div class="staff-unavailable-state" role="status">
              <p>{{ section.description }}</p>
            </div>
          </section>
        </div>

        <footer class="staff-footer">
          <span>MediQueue · Hospital staff workspace</span>
          <span>Preview only · Operational services unavailable</span>
        </footer>
      </main>
    </div>
  </div>
</template>
