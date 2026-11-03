<script setup lang="ts">
import { computed, ref } from "vue";
import { Activity } from "@lucide/vue";
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useMobileNavigation } from "@/composables/useMobileNavigation";
import DoctorSidebar, {
  type DoctorSection,
} from "@/components/Doctor/DoctorSidebar.vue";
import DoctorTopbar from "@/components/Doctor/DoctorTopbar.vue";
import AppointmentTable from "@/components/Doctor/DoctorAppointmentTable.vue";
import {
  appointmentStatuses,
  filterAppointments,
  filterPatients,
  patientStatuses,
  type DoctorAppointment,
  type DoctorPatient,
} from "@/components/Doctor/doctorDashboard.types";
import "@/assets/doctor.css";

const auth = useAuthStore();
const activeSection = ref<DoctorSection>("overview");
const {
  isMobile: mobileViewport,
  isOpen: mobileNavigationOpen,
  root: mobileNavigationRoot,
  toggle: toggleMobileNavigation,
  close: closeMobileNavigation,
} = useMobileNavigation({
  breakpoint: 800,
  trigger: ".doctor-menu-trigger",
  firstNavigationItem: ".doctor-navigation .doctor-nav-link",
});
const searchQuery = ref("");
const appointmentStatus = ref<(typeof appointmentStatuses)[number]>("All");
const patientStatus = ref<(typeof patientStatuses)[number]>("All");
const appointments = ref<DoctorAppointment[]>([]);
const patients = ref<DoctorPatient[]>([]);
const profileInformation = computed(() => {
  const user = auth.user;
  const firstName = user?.firstName?.trim() ?? "";
  const lastName = user?.lastName?.trim() ?? "";
  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  const username = user?.username?.trim() ?? "";
  return {
    displayName: displayName || username,
    username,
    role: user?.role
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : "",
  };
});
const doctorDisplayName = computed(
  () =>
    profileInformation.value.displayName || "Profile information unavailable.",
);
const doctorRole = computed(
  () => profileInformation.value.role || "Profile information unavailable.",
);
const searchAvailable = computed(
  () =>
    (activeSection.value === "appointments" && appointments.value.length > 0) ||
    (activeSection.value === "patients" && patients.value.length > 0),
);
const sectionTitles: Record<DoctorSection, string> = {
  overview: "Doctor overview",
  appointments: "Appointment management",
  patients: "Patient directory",
  notifications: "Notifications",
  profile: "Doctor profile",
  settings: "Workspace settings",
};
const sectionTitle = computed(() => sectionTitles[activeSection.value]);
const visibleAppointments = computed(() =>
  filterAppointments(
    appointments.value,
    searchQuery.value,
    activeSection.value === "appointments" ? appointmentStatus.value : "All",
  ),
);
const visiblePatients = computed(() =>
  filterPatients(patients.value, searchQuery.value, patientStatus.value),
);
const consultationQueue = computed(() =>
  appointments.value.filter(
    (appointment) =>
      appointment.status === "Waiting" ||
      appointment.status === "In consultation",
  ),
);

function navigateTo(section: DoctorSection) {
  activeSection.value = section;
  searchQuery.value = "";
  void closeMobileNavigation();
}
</script>

<template>
  <div ref="mobileNavigationRoot" class="doctor-workspace">
    <a class="doctor-skip-link" href="#doctor-main-content">
      Skip to main content
    </a>
    <DoctorSidebar
      :active-section="activeSection"
      :mobile-open="mobileNavigationOpen"
      :mobile-viewport="mobileViewport"
      @navigate="navigateTo"
      @close="closeMobileNavigation"
    />

    <div class="doctor-main-shell">
      <DoctorTopbar
        :title="sectionTitle"
        :doctor-name="doctorDisplayName"
        :doctor-role="doctorRole"
        :mobile-navigation-open="mobileNavigationOpen"
        :search-enabled="
          activeSection === 'appointments' || activeSection === 'patients'
        "
        :search-available="searchAvailable"
        :search-query="searchQuery"
        @toggle-navigation="toggleMobileNavigation"
        @update:search-query="searchQuery = $event"
        @notifications="navigateTo('notifications')"
        @profile="navigateTo('profile')"
      />

      <main id="doctor-main-content" class="doctor-content">
        <div class="doctor-integration-banner" role="note">
          <span class="doctor-integration-banner-mark" aria-hidden="true"
            >i</span
          >
          <p>
            <strong>Backend integration pending.</strong>
            Appointment, patient, queue and notification data will appear here
            when connected to the clinical system.
          </p>
        </div>

        <template v-if="activeSection === 'overview'">
          <section class="doctor-welcome">
            <div>
              <span class="doctor-eyebrow">YOUR WORKSPACE</span>
              <h2>Doctor overview</h2>
              <p>
                Review assigned patient and appointment workflows when your
                provider’s clinical service and permissions are connected.
              </p>
            </div>
            <span class="doctor-preview-badge">Awaiting integration</span>
          </section>

          <section
            class="doctor-panel"
            aria-labelledby="consultation-queue-title"
          >
            <div class="doctor-panel-heading">
              <div>
                <span class="doctor-eyebrow">CONSULTATION QUEUE</span>
                <h2 id="consultation-queue-title">Consultation queue</h2>
                <p>
                  Assigned queue information will appear when the clinical
                  service is connected.
                </p>
              </div>
              <button
                class="doctor-text-action"
                type="button"
                @click="navigateTo('appointments')"
              >
                View appointments
              </button>
            </div>
            <div v-if="consultationQueue.length" class="doctor-queue-list">
              <article
                v-for="appointment in consultationQueue"
                :key="appointment.id"
                class="doctor-queue-item"
              >
                <span class="doctor-queue-time">{{ appointment.time }}</span>
                <span class="doctor-queue-avatar" aria-hidden="true">{{
                  appointment.patientName.slice(0, 1)
                }}</span>
                <div class="doctor-queue-person">
                  <strong>{{ appointment.patientName }}</strong>
                  <span
                    >{{ appointment.visitType }} · {{ appointment.id }}</span
                  >
                </div>
                <span
                  class="doctor-status"
                  :class="`status-${appointment.status
                    .toLowerCase()
                    .replaceAll(' ', '-')}`"
                  >{{ appointment.status }}</span
                >
              </article>
            </div>
            <p v-else class="doctor-empty-state">
              Consultation queue data is unavailable until the clinical service
              is connected.
            </p>
          </section>

          <section class="doctor-panel" aria-labelledby="daily-schedule-title">
            <div class="doctor-panel-heading">
              <div>
                <span class="doctor-eyebrow">SCHEDULE</span>
                <h2 id="daily-schedule-title">Today's appointments</h2>
              </div>
              <span class="doctor-count-label">Awaiting integration</span>
            </div>
            <AppointmentTable :appointments="visibleAppointments" />
          </section>
        </template>

        <template v-else-if="activeSection === 'appointments'">
          <section class="doctor-page-intro">
            <div>
              <span class="doctor-eyebrow">SCHEDULE</span>
              <h2>Appointment management</h2>
              <p>
                Review appointments assigned to you when the clinical scheduling
                service is connected.
              </p>
            </div>
            <label class="doctor-filter-control">
              <span>Status</span>
              <select
                v-model="appointmentStatus"
                aria-label="Filter appointments by status"
                :disabled="appointments.length === 0"
              >
                <option
                  v-for="status in appointmentStatuses"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </label>
          </section>
          <section class="doctor-panel" aria-label="Appointments">
            <div class="doctor-table-heading">
              <span>Appointments</span>
              <span>Awaiting backend integration</span>
            </div>
            <AppointmentTable :appointments="visibleAppointments" />
          </section>
        </template>

        <template v-else-if="activeSection === 'patients'">
          <section class="doctor-page-intro">
            <div>
              <span class="doctor-eyebrow">PATIENT RECORDS</span>
              <h2>Patient directory</h2>
              <p>
                Patient records assigned to you will appear when the clinical
                service is connected and your account is authorized.
              </p>
            </div>
            <label class="doctor-filter-control">
              <span>Record status</span>
              <select
                v-model="patientStatus"
                aria-label="Filter patients by directory status"
                :disabled="patients.length === 0"
              >
                <option
                  v-for="status in patientStatuses"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </label>
          </section>
          <section class="doctor-panel" aria-label="Patient directory">
            <div class="doctor-table-heading">
              <span>Patient records</span>
              <span>Awaiting backend integration</span>
            </div>
            <div class="doctor-table-scroll">
              <table class="doctor-table">
                <thead>
                  <tr>
                    <th scope="col">Patient</th>
                    <th scope="col">Record ID</th>
                    <th scope="col">Age</th>
                    <th scope="col">Visit type</th>
                    <th scope="col">Last visit</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="patient in visiblePatients" :key="patient.id">
                    <td>
                      <span class="doctor-table-person">
                        <span class="doctor-queue-avatar" aria-hidden="true">{{
                          patient.name.slice(0, 1)
                        }}</span>
                        <strong>{{ patient.name }}</strong>
                      </span>
                    </td>
                    <td class="doctor-id-cell">{{ patient.id }}</td>
                    <td>{{ patient.age }}</td>
                    <td>{{ patient.visitType }}</td>
                    <td>{{ patient.lastVisit }}</td>
                    <td>
                      <span
                        class="doctor-status"
                        :class="
                          patient.status === 'Active'
                            ? 'status-active'
                            : 'status-follow-up'
                        "
                        >{{ patient.status }}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="visiblePatients.length === 0" class="doctor-empty-state">
                Patient records are unavailable until the clinical service is
                connected.
              </p>
            </div>
          </section>
        </template>

        <template v-else-if="activeSection === 'notifications'">
          <section class="doctor-page-intro">
            <div>
              <span class="doctor-eyebrow">NOTIFICATIONS</span>
              <h2>Notifications</h2>
              <p>
                Visit and queue updates for your assigned workflows will appear
                here when notification services are connected.
              </p>
            </div>
          </section>
          <section class="doctor-panel">
            <p class="doctor-empty-state">
              Notification data is unavailable until a notification service is
              connected.
            </p>
          </section>
        </template>

        <template v-else-if="activeSection === 'profile'">
          <section class="doctor-page-intro">
            <div>
              <span class="doctor-eyebrow">ACCOUNT</span>
              <h2>Doctor profile</h2>
              <p>Profile details are limited to your authenticated session.</p>
            </div>
          </section>
          <section class="doctor-panel doctor-profile-card">
            <div>
              <span class="doctor-eyebrow">SIGNED-IN ACCOUNT</span>
              <template v-if="profileInformation.displayName">
                <h3>{{ profileInformation.displayName }}</h3>
                <dl class="doctor-profile-facts">
                  <div v-if="profileInformation.username">
                    <dt>Username</dt>
                    <dd>{{ profileInformation.username }}</dd>
                  </div>
                  <div v-if="profileInformation.role">
                    <dt>Role</dt>
                    <dd>{{ profileInformation.role }}</dd>
                  </div>
                </dl>
              </template>
              <p v-else class="doctor-empty-state">
                Profile information unavailable.
              </p>
            </div>
          </section>
        </template>

        <template v-else>
          <section class="doctor-page-intro">
            <div>
              <span class="doctor-eyebrow">LOCAL PREFERENCES</span>
              <h2>Workspace settings</h2>
              <p>Theme preference is shared across the application.</p>
            </div>
          </section>
          <section class="doctor-panel doctor-settings-list">
            <div class="doctor-setting-row">
              <div>
                <strong>Appearance</strong>
                <p>Choose light, dark, or follow your device preference.</p>
              </div>
              <ThemeSwitcher />
            </div>
            <div class="doctor-setting-row">
              <div>
                <strong>Appointment reminders</strong>
                <p>Unavailable until notification services are connected.</p>
              </div>
              <span class="doctor-setting-status">Unavailable</span>
            </div>
          </section>
        </template>

        <footer class="doctor-footer">
          MediQueue · Doctor workspace
          <span>Backend integration pending</span>
        </footer>
      </main>
    </div>
  </div>
</template>
