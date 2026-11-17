<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
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
import {
  mediqueueService,
  type DepartmentRecord,
  type NotificationRecord,
  type QueueTicketRecord,
} from "@/services/mediqueue.service";
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

function setNavigationRoot(element: unknown) {
  mobileNavigationRoot.value = element instanceof HTMLElement ? element : null;
}

const searchQuery = ref("");
const appointmentStatus = ref<(typeof appointmentStatuses)[number]>("All");
const patientStatus = ref<(typeof patientStatuses)[number]>("All");
const appointments = ref<DoctorAppointment[]>([]);
const patients = ref<DoctorPatient[]>([]);
const summary = ref<{
  hospitalId: number | null;
  onDuty: boolean;
  waitingTickets: number;
  openEmergencyCases: number;
} | null>(null);
const departments = ref<DepartmentRecord[]>([]);
const queueTickets = ref<QueueTicketRecord[]>([]);
const notifications = ref<NotificationRecord[]>([]);
const isLoading = ref(true);
const sectionError = ref("");
const actionMessage = ref("");
const busyDepartmentId = ref<number | null>(null);
const busyTicketId = ref<number | null>(null);
const recordTicketId = ref<number | null>(null);
const isSavingRecord = ref(false);
const recordError = ref("");
const recordNotice = ref("");
const clinicalRecord = reactive({
  diagnosis: "",
  treatment: "",
  prescription: "",
});
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

function displayQueueStatus(status: QueueTicketRecord["status"]) {
  return status === "CALLED" ? "In consultation" : "Waiting";
}

function formatQueueTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadDoctorWorkspace() {
  isLoading.value = true;
  sectionError.value = "";
  const errors: string[] = [];
  try {
    summary.value = await mediqueueService.getDoctorSummary();
    const hospitalId = summary.value.hospitalId;
    if (hospitalId === null) {
      departments.value = [];
      queueTickets.value = [];
      appointments.value = [];
      patients.value = [];
      sectionError.value = "This doctor account is not associated with a hospital.";
      return;
    }

    const [departmentResult, notificationResult] = await Promise.allSettled([
      mediqueueService.getDepartments(hospitalId),
      mediqueueService.getNotifications(),
    ]);
    if (departmentResult.status === "fulfilled") {
      departments.value = departmentResult.value;
    } else {
      departments.value = [];
      errors.push("departments");
    }
    if (notificationResult.status === "fulfilled") {
      notifications.value = notificationResult.value;
    } else {
      notifications.value = [];
      errors.push("notifications");
    }

    const departmentRecords = departments.value;
    const queueResults = await Promise.allSettled(
      departmentRecords.map((department) =>
        mediqueueService.getDepartmentQueue(department.id),
      ),
    );
    queueTickets.value = queueResults.flatMap((result, index) => {
      const department = departmentRecords[index];
      if (!department) return [];
      if (result.status === "rejected") {
        errors.push(`queue for ${department.name}`);
        return [];
      }
      return result.value
        .filter((ticket) => ticket.status === "WAITING" || ticket.status === "CALLED")
        .map((ticket) => ticket);
    });

    appointments.value = queueTickets.value.map((ticket) => ({
      id: String(ticket.id),
      patientId: String(ticket.patientId),
      patientName: `Patient #${ticket.patientId}`,
      time: formatQueueTime(ticket.joinedAt),
      visitType: ticket.departmentName,
      status: displayQueueStatus(ticket.status),
      queueTicketId: ticket.id,
      departmentId: ticket.departmentId,
    }));
    const patientById = new Map<number, DoctorPatient>();
    queueTickets.value.forEach((ticket) => {
      patientById.set(ticket.patientId, {
        id: String(ticket.patientId),
        name: `Patient #${ticket.patientId}`,
        lastVisit: formatQueueTime(ticket.joinedAt),
        visitType: ticket.departmentName,
        status: "Active",
        queueTicketId: ticket.id,
      });
    });
    patients.value = [...patientById.values()];
    if (errors.length) {
      sectionError.value = `Some live data could not be loaded: ${errors.join(", ")}.`;
    }
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to load the doctor workspace.";
  } finally {
    isLoading.value = false;
  }
}

async function callNext(departmentId: number) {
  busyDepartmentId.value = departmentId;
  sectionError.value = "";
  try {
    const ticket = await mediqueueService.callNext(departmentId);
    actionMessage.value = `Queue ticket #${ticket.id} was called.`;
    await loadDoctorWorkspace();
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to call the next queue ticket.";
  } finally {
    busyDepartmentId.value = null;
  }
}

async function completeTicket(ticket: QueueTicketRecord) {
  busyTicketId.value = ticket.id;
  sectionError.value = "";
  try {
    await mediqueueService.completeQueueTicket(ticket.departmentId, ticket.id);
    actionMessage.value = `Queue ticket #${ticket.id} was completed.`;
    await loadDoctorWorkspace();
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to complete this queue ticket.";
  } finally {
    busyTicketId.value = null;
  }
}

function completeTicketById(ticketId: number) {
  const ticket = queueTickets.value.find((item) => item.id === ticketId);
  if (!ticket) {
    sectionError.value = "The selected queue ticket is no longer available.";
    return;
  }
  void completeTicket(ticket);
}

async function saveClinicalRecord() {
  const ticketId = recordTicketId.value;
  if (!ticketId) return;
  recordError.value = "";
  recordNotice.value = "";
  isSavingRecord.value = true;
  try {
    await mediqueueService.createClinicalRecord(ticketId, {
      diagnosis: clinicalRecord.diagnosis.trim(),
      treatment: clinicalRecord.treatment.trim(),
      prescription: clinicalRecord.prescription.trim() || undefined,
    });
    recordNotice.value = "Clinical record saved.";
    Object.assign(clinicalRecord, {
      diagnosis: "",
      treatment: "",
      prescription: "",
    });
    recordTicketId.value = null;
  } catch (error) {
    recordError.value =
      error instanceof Error ? error.message : "Unable to save the clinical record.";
  } finally {
    isSavingRecord.value = false;
  }
}

async function markNotificationRead(notification: NotificationRecord) {
  sectionError.value = "";
  try {
    await mediqueueService.markNotificationRead(notification.id);
    notification.unread = false;
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to mark the notification as read.";
  }
}

async function toggleAvailability() {
  const hospitalId = summary.value?.hospitalId;
  const doctorId = auth.user?.id;
  if (hospitalId === null || hospitalId === undefined || !doctorId) {
    sectionError.value = "Your doctor or hospital account could not be identified.";
    return;
  }
  sectionError.value = "";
  try {
    await mediqueueService.setDoctorAvailability(
      hospitalId,
      doctorId,
      !summary.value?.onDuty,
    );
    await loadDoctorWorkspace();
  } catch (error) {
    sectionError.value =
      error instanceof Error ? error.message : "Unable to update availability.";
  }
}

function navigateTo(section: DoctorSection) {
  activeSection.value = section;
  searchQuery.value = "";
  void closeMobileNavigation();
}

onMounted(() => void loadDoctorWorkspace());
</script>

<template>
  <div :ref="setNavigationRoot" class="doctor-workspace">
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
            <strong>Live hospital services connected.</strong>
            Queue activity, notifications, clinical records, and doctor
            availability use the authenticated API.
          </p>
        </div>

        <template v-if="activeSection === 'overview'">
          <section class="doctor-welcome">
            <div>
              <span class="doctor-eyebrow">YOUR WORKSPACE</span>
              <h2>Doctor overview</h2>
              <p>
                Review live queue activity and care workflow information.
              </p>
            </div>
            <span class="doctor-preview-badge">
              {{ isLoading ? "Loading" : summary?.onDuty ? "On duty" : "Off duty" }}
            </span>
          </section>

          <p v-if="isLoading" class="doctor-empty-state" role="status">
            Loading your live doctor workspace…
          </p>
          <p v-if="sectionError" class="doctor-empty-state" role="alert">
            {{ sectionError }}
            <button type="button" @click="loadDoctorWorkspace">Retry</button>
          </p>
          <p v-if="actionMessage" class="doctor-empty-state" role="status">
            {{ actionMessage }}
          </p>

          <section v-if="summary" class="doctor-panel doctor-summary-grid" aria-label="Live hospital summary">
            <article><span>Waiting tickets</span><strong>{{ summary.waitingTickets }}</strong></article>
            <article><span>Open emergency cases</span><strong>{{ summary.openEmergencyCases }}</strong></article>
            <article><span>Availability</span><strong>{{ summary.onDuty ? "On duty" : "Off duty" }}</strong></article>
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
                  Active queue tickets in departments you are authorized to manage.
                </p>
              </div>
              <button
                class="doctor-text-action"
                type="button"
                @click="navigateTo('appointments')"
              >
                View queue activity
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
                <button
                  v-if="appointment.status === 'In consultation' && appointment.queueTicketId"
                  class="doctor-text-action"
                  type="button"
                  @click="recordTicketId = appointment.queueTicketId"
                >
                  Add clinical record
                </button>
                <button
                  v-if="appointment.status === 'In consultation' && appointment.queueTicketId"
                  class="doctor-text-action"
                  type="button"
                  :disabled="busyTicketId === appointment.queueTicketId"
                  @click="completeTicketById(appointment.queueTicketId)"
                >
                  {{ busyTicketId === appointment.queueTicketId ? "Completing…" : "Complete" }}
                </button>
              </article>
            </div>
            <p v-else class="doctor-empty-state">
              No active tickets were returned for your departments.
            </p>
          </section>

          <section v-if="recordTicketId" class="doctor-panel">
            <h2>Record clinical findings for ticket #{{ recordTicketId }}</h2>
            <form class="doctor-record-form" @submit.prevent="saveClinicalRecord">
              <label>Diagnosis<textarea v-model="clinicalRecord.diagnosis" maxlength="2000" required /></label>
              <label>Treatment<textarea v-model="clinicalRecord.treatment" maxlength="4000" required /></label>
              <label>Prescription<textarea v-model="clinicalRecord.prescription" maxlength="2000" /></label>
              <p v-if="recordError" role="alert">{{ recordError }}</p>
              <p v-if="recordNotice" role="status">{{ recordNotice }}</p>
              <button class="doctor-text-action" type="submit" :disabled="isSavingRecord">{{ isSavingRecord ? "Saving…" : "Save clinical record" }}</button>
              <button class="doctor-text-action" type="button" @click="recordTicketId = null">Cancel</button>
            </form>
          </section>

          <section v-if="departments.length" class="doctor-panel">
            <div class="doctor-panel-heading"><div><span class="doctor-eyebrow">QUEUE ACTIONS</span><h2>Call next patient</h2></div></div>
            <div v-for="department in departments" :key="department.id" class="doctor-setting-row">
              <span>{{ department.name }}</span>
              <button class="doctor-text-action" type="button" :disabled="busyDepartmentId === department.id" @click="callNext(department.id)">
                {{ busyDepartmentId === department.id ? "Calling…" : "Call next" }}
              </button>
            </div>
          </section>

          <section class="doctor-panel" aria-labelledby="daily-schedule-title">
            <div class="doctor-panel-heading">
              <div>
                <span class="doctor-eyebrow">SCHEDULE</span>
                <h2 id="daily-schedule-title">Active queue tickets</h2>
              </div>
              <span class="doctor-count-label">{{ queueTickets.length }} tickets</span>
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
                Appointment listings are patient-scoped in the current API;
                doctor-specific schedules are not exposed.
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
            <p class="doctor-empty-state">
              No doctor appointment-list endpoint is available. Active queue
              tickets are shown on the overview.
            </p>
          </section>
        </template>

        <template v-else-if="activeSection === 'patients'">
          <section class="doctor-page-intro">
            <div>
              <span class="doctor-eyebrow">PATIENT RECORDS</span>
              <h2>Patient directory</h2>
              <p>
                Patient identifiers below are derived from active queue
                tickets; demographic details are not returned by the queue API.
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
                    <th scope="col">Queue ticket</th>
                    <th scope="col">Department</th>
                    <th scope="col">Joined</th>
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
                    <td>{{ patient.queueTicketId }}</td>
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
                No patients are currently represented in the active queue.
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
                Notifications for your authenticated account.
              </p>
            </div>
          </section>
          <section class="doctor-panel">
            <ul v-if="notifications.length" class="doctor-notification-list">
              <li v-for="notification in notifications" :key="notification.id">
                <strong>{{ notification.title }}</strong>
                <p>{{ notification.message }}</p>
                <time>{{ new Date(notification.createdAt).toLocaleString() }}</time>
                <button
                  v-if="notification.unread"
                  class="doctor-text-action"
                  type="button"
                  @click="markNotificationRead(notification)"
                >
                  Mark read
                </button>
              </li>
            </ul>
            <p v-else class="doctor-empty-state">No notifications were returned.</p>
          </section>
        </template>

        <template v-else-if="activeSection === 'profile'">
          <section class="doctor-page-intro">
            <div>
              <span class="doctor-eyebrow">ACCOUNT</span>
              <h2>Doctor profile</h2>
              <p>Profile details come from your authenticated account.</p>
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
                  <div v-if="auth.user?.backendRole">
                    <dt>Backend role</dt>
                    <dd>{{ auth.user.backendRole }}</dd>
                  </div>
                  <div v-if="auth.user?.email">
                    <dt>Email</dt>
                    <dd>{{ auth.user.email }}</dd>
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
                <strong>Doctor availability</strong>
                <p>Update your availability for your assigned hospital.</p>
              </div>
              <button
                class="doctor-text-action"
                type="button"
                :disabled="!summary"
                @click="toggleAvailability"
              >
                {{ summary?.onDuty ? "Set off duty" : "Set on duty" }}
              </button>
              <span class="doctor-setting-status">
                {{ summary?.onDuty ? "On duty" : "Off duty" }}
              </span>
            </div>
          </section>
        </template>

        <footer class="doctor-footer">
          MediQueue · Doctor workspace
          <span>Live authorized hospital data</span>
        </footer>
      </main>
    </div>
  </div>
</template>
