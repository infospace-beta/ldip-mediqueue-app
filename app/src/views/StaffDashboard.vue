<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Activity, Menu, X } from "@lucide/vue";
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";
import StaffSidebar from "@/components/Staff/StaffSidebar.vue";
import {
  staffNavigation,
  type StaffSectionId,
} from "@/components/Staff/staffNavigation";
import { useMobileNavigation } from "@/composables/useMobileNavigation";
import { useAuthStore } from "@/stores/auth.store";
import { useHospitalWorkspaceStore } from "@/stores/hospitalWorkspace.store";
import {
  mediqueueService,
  type DepartmentRecord,
  type EmergencyRecord,
  type NotificationRecord,
  type QueueTicketRecord,
  type UserRecord,
} from "@/services/mediqueue.service";
import "../assets/staff.css";

const auth = useAuthStore();
const hospitalWorkspace = useHospitalWorkspaceStore();
const activeSectionId = ref<StaffSectionId>("operations");
const summary = ref<{
  hospitalId: number | null;
  waitingTickets: number;
  openEmergencyCases: number;
  onDutyDoctors: number;
} | null>(null);
const departments = ref<DepartmentRecord[]>([]);
const queueItems = ref<(QueueTicketRecord & { departmentName: string })[]>([]);
const staffMembers = ref<UserRecord[]>([]);
const doctors = ref<UserRecord[]>([]);
const emergencies = ref<EmergencyRecord[]>([]);
const notifications = ref<NotificationRecord[]>([]);
const loading = ref(true);
const sectionErrors = ref<string[]>([]);
const actionError = ref("");
const busyTicketId = ref<number | null>(null);
const isCallingNext = ref<number | null>(null);
const isMarkingRead = ref(false);
const activeSection = computed(() =>
  staffNavigation.find((section) => section.id === activeSectionId.value),
);
const {
  isMobile: mobileViewport,
  isOpen: mobileNavigationOpen,
  root: mobileNavigationRoot,
  toggle: toggleMobileNavigation,
  close: closeMobileNavigation,
} = useMobileNavigation({
  breakpoint: 760,
  trigger: ".staff-menu-button",
  firstNavigationItem: ".staff-navigation .staff-nav-link",
});

function setNavigationRoot(element: unknown) {
  mobileNavigationRoot.value = element instanceof HTMLElement ? element : null;
}

function navigateTo(section: StaffSectionId) {
  activeSectionId.value = section;
  void closeMobileNavigation();
}

async function loadOperations() {
  loading.value = true;
  sectionErrors.value = [];
  actionError.value = "";
  const errors: string[] = [];
  try {
    const staffUserId = auth.user?.id;
    if (staffUserId) {
      const workspaceLoaded = await hospitalWorkspace.loadAssignments(staffUserId);
      if (!workspaceLoaded && hospitalWorkspace.error) {
        errors.push(hospitalWorkspace.error);
      }
    }

    summary.value = await mediqueueService.getStaffSummary();
    const hospitalId = summary.value.hospitalId;
    if (hospitalId === null) {
      departments.value = [];
      queueItems.value = [];
      sectionErrors.value = ["This staff account is not assigned to a hospital."];
      return;
    }

    if (!staffUserId) {
      throw new Error("Your staff account could not be identified.");
    }
    const [departmentResult, staffResult, doctorResult, emergencyResult, notificationResult] =
      await Promise.allSettled([
        mediqueueService.getDepartments(hospitalId),
        mediqueueService.getHospitalStaff(hospitalId),
        mediqueueService.getHospitalDoctors(hospitalId),
        mediqueueService.getHospitalEmergencyCases(hospitalId),
        mediqueueService.getNotifications(),
      ]);

    if (departmentResult.status === "fulfilled") {
      departments.value = departmentResult.value;
    } else {
      errors.push("departments");
    }
    if (staffResult.status === "fulfilled") staffMembers.value = staffResult.value;
    else errors.push("staff roster");
    if (doctorResult.status === "fulfilled") doctors.value = doctorResult.value;
    else errors.push("doctor roster");
    if (emergencyResult.status === "fulfilled") emergencies.value = emergencyResult.value;
    else errors.push("emergency cases");
    if (notificationResult.status === "fulfilled") notifications.value = notificationResult.value;
    else errors.push("notifications");

    const queueDepartments = departments.value;
    const queueResults = await Promise.allSettled(
      queueDepartments.map((department) =>
        mediqueueService.getDepartmentQueue(department.id),
      ),
    );
    queueItems.value = queueResults.flatMap((result, index) => {
      const department = queueDepartments[index];
      if (!department) return [];
      if (result.status === "rejected") {
        errors.push(`queue for ${department.name}`);
        return [];
      }
      return result.value
        .filter((ticket) => ticket.status === "WAITING" || ticket.status === "CALLED")
        .map((ticket) => ({
          ...ticket,
          departmentName: department.name,
        }));
    });
    sectionErrors.value = errors.length
      ? [`Some live sections could not be loaded: ${errors.join(", ")}.`]
      : [];
  } catch (error) {
    sectionErrors.value = [
      error instanceof Error ? error.message : "Unable to load hospital operations.",
    ];
  } finally {
    loading.value = false;
  }
}

async function callNext(departmentId: number) {
  actionError.value = "";
  isCallingNext.value = departmentId;
  try {
    await mediqueueService.callNext(departmentId);
    await loadOperations();
  } catch (error) {
    actionError.value =
      error instanceof Error ? error.message : "Unable to call the next queue ticket.";
  } finally {
    isCallingNext.value = null;
  }
}

async function updateTicket(ticket: QueueTicketRecord, action: "skip" | "complete") {
  actionError.value = "";
  busyTicketId.value = ticket.id;
  try {
    if (action === "skip") {
      await mediqueueService.skipQueueTicket(ticket.departmentId, ticket.id);
    } else {
      await mediqueueService.completeQueueTicket(ticket.departmentId, ticket.id);
    }
    await loadOperations();
  } catch (error) {
    actionError.value =
      error instanceof Error ? error.message : `Unable to ${action} this ticket.`;
  } finally {
    busyTicketId.value = null;
  }
}

async function markAllRead() {
  isMarkingRead.value = true;
  actionError.value = "";
  try {
    await mediqueueService.markAllNotificationsRead();
    notifications.value = notifications.value.map((item) => ({
      ...item,
      unread: false,
    }));
  } catch (error) {
    actionError.value =
      error instanceof Error ? error.message : "Unable to mark notifications as read.";
  } finally {
    isMarkingRead.value = false;
  }
}

onMounted(() => void loadOperations());
</script>

<template>
  <div :ref="setNavigationRoot" class="staff-dashboard">
    <a class="staff-skip-link" href="#staff-main-content">Skip to main content</a>
    <StaffSidebar
      :active-section="activeSectionId"
      :mobile-open="mobileNavigationOpen"
      :mobile-viewport="mobileViewport"
      :navigation="staffNavigation"
      @navigate="navigateTo"
      @close="closeMobileNavigation"
    />

    <div class="staff-main">
      <header class="staff-topbar">
        <div class="staff-topbar-heading">
          <span class="staff-eyebrow">MEDIQUEUE / STAFF</span>
          <h1>{{ activeSection?.title ?? "Hospital operations" }}</h1>
        </div>
        <div class="staff-topbar-actions">
          <ThemeSwitcher />
          <button
            class="staff-menu-button"
            type="button"
            :aria-expanded="mobileNavigationOpen"
            aria-controls="staff-navigation"
            :aria-label="mobileNavigationOpen ? 'Close navigation' : 'Open navigation'"
            @click="toggleMobileNavigation"
          >
            <X v-if="mobileNavigationOpen" :size="20" aria-hidden="true" />
            <Menu v-else :size="20" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="staff-main-content" class="staff-content">
        <section class="staff-intro" aria-labelledby="staff-page-title">
          <div>
            <span class="staff-eyebrow">STAFF WORKSPACE</span>
            <h2 id="staff-page-title">{{ activeSection?.title }}</h2>
            <p>
              Live data and queue controls are provided by the hospital API.
              Backend authorization is enforced for every operation.
            </p>
          </div>
          <span class="staff-preview-badge">{{ loading ? "Loading" : "Live data" }}</span>
        </section>

        <section v-if="loading" class="staff-connection-alert" role="status">
          <Activity :size="19" aria-hidden="true" />
          <p>Loading hospital operations…</p>
        </section>
        <section v-for="error in sectionErrors" :key="error" class="staff-connection-alert" role="alert">
          <Activity :size="19" aria-hidden="true" />
          <p>{{ error }} <button type="button" @click="loadOperations">Retry</button></p>
        </section>
        <p v-if="actionError" class="staff-connection-alert" role="alert">
          {{ actionError }}
        </p>

        <div class="staff-section-anchors" aria-hidden="true">
          <span v-for="section in staffNavigation" :id="section.id" :key="section.id"></span>
        </div>

        <template v-if="!loading && summary && activeSectionId === 'operations'">
          <section class="staff-section staff-overview-section">
            <div class="staff-section-heading">
              <div>
                <span class="staff-eyebrow">OVERVIEW</span>
                <h2>Operations at a glance</h2>
              </div>
              <span class="staff-unavailable-label">Live summary</span>
            </div>
            <div class="staff-metrics-grid">
              <article class="staff-metric-card">
                <span>Waiting tickets</span><strong>{{ summary.waitingTickets }}</strong>
              </article>
              <article class="staff-metric-card">
                <span>Open emergency cases</span><strong>{{ summary.openEmergencyCases }}</strong>
              </article>
              <article class="staff-metric-card">
                <span>Doctors on duty</span><strong>{{ summary.onDutyDoctors }}</strong>
              </article>
              <article class="staff-metric-card">
                <span>Departments</span><strong>{{ departments.length }}</strong>
              </article>
            </div>
            <p v-if="hospitalWorkspace.currentHospital" class="staff-section-description">
              {{ hospitalWorkspace.currentHospital.name }}
            </p>
          </section>
        </template>

        <template v-else-if="activeSectionId === 'queue' || activeSectionId === 'patient-flow'">
          <section class="staff-section">
            <div class="staff-section-heading">
              <div><span class="staff-eyebrow">QUEUE OPERATIONS</span><h2>Department queues</h2></div>
              <button type="button" class="button button-secondary" @click="loadOperations">Refresh</button>
            </div>
            <div v-if="!departments.length" class="staff-unavailable-state">No active departments are available.</div>
            <article v-for="department in departments" :key="department.id" class="staff-section staff-queue-department">
              <div class="staff-section-heading">
                <div><h3>{{ department.name }}</h3><span>{{ department.code }}</span></div>
                <button class="button button-primary" type="button" :disabled="isCallingNext === department.id" @click="callNext(department.id)">
                  {{ isCallingNext === department.id ? "Calling…" : "Call next" }}
                </button>
              </div>
              <ul class="staff-queue-list">
                <li v-for="ticket in queueItems.filter(item => item.departmentId === department.id)" :key="ticket.id">
                  <span>Ticket #{{ ticket.id }} · Patient #{{ ticket.patientId }}</span>
                  <strong>{{ ticket.status }}<small v-if="ticket.position"> · Position {{ ticket.position }}</small></strong>
                  <div class="staff-queue-actions">
                    <button v-if="ticket.status === 'WAITING'" type="button" :disabled="busyTicketId === ticket.id" @click="updateTicket(ticket, 'skip')">Skip</button>
                    <button v-if="ticket.status === 'CALLED'" type="button" :disabled="busyTicketId === ticket.id" @click="updateTicket(ticket, 'complete')">Complete</button>
                  </div>
                </li>
              </ul>
              <p v-if="!queueItems.some(item => item.departmentId === department.id)" class="staff-unavailable-state">
                No queue tickets were returned for this department.
              </p>
            </article>
          </section>
        </template>

        <template v-else-if="activeSectionId === 'departments'">
          <section class="staff-section">
            <div class="staff-section-heading"><div><span class="staff-eyebrow">DIRECTORY</span><h2>Active departments</h2></div></div>
            <ul class="staff-record-list">
              <li v-for="department in departments" :key="department.id">
                <strong>{{ department.name }}</strong><span>{{ department.code }}</span>
              </li>
            </ul>
            <p v-if="!departments.length" class="staff-unavailable-state">No active departments were returned.</p>
          </section>
        </template>

        <template v-else-if="activeSectionId === 'medical-staff' || activeSectionId === 'patients'">
          <section class="staff-section">
            <div class="staff-section-heading"><div><span class="staff-eyebrow">CARE TEAM</span><h2>{{ activeSectionId === 'patients' ? 'Patients currently in queue' : 'Hospital staff and doctors' }}</h2></div></div>
            <ul v-if="activeSectionId === 'medical-staff'" class="staff-record-list">
              <li v-for="member in [...staffMembers, ...doctors]" :key="member.id">
                <strong>{{ member.fullName }}</strong><span>{{ member.role }}<template v-if="member.onDuty"> · On duty</template></span>
              </li>
            </ul>
            <ul v-else class="staff-record-list">
              <li v-for="ticket in queueItems" :key="ticket.id">
                <strong>Patient #{{ ticket.patientId }}</strong><span>Ticket #{{ ticket.id }} · {{ ticket.departmentName }} · {{ ticket.status }}</span>
              </li>
            </ul>
            <p v-if="activeSectionId === 'medical-staff' && !staffMembers.length && !doctors.length" class="staff-unavailable-state">No staff records were returned.</p>
            <p v-if="activeSectionId === 'patients' && !queueItems.length" class="staff-unavailable-state">No current queue patients were returned.</p>
          </section>
        </template>

        <template v-else-if="activeSectionId === 'emergency'">
          <section class="staff-section">
            <div class="staff-section-heading"><div><span class="staff-eyebrow">EMERGENCY CASES</span><h2>Hospital emergency activity</h2></div></div>
            <ul class="staff-record-list">
              <li v-for="item in emergencies" :key="item.id">
                <strong>#{{ item.id }} · {{ item.title }}</strong><span>{{ item.severity }} · {{ item.status }}</span>
              </li>
            </ul>
            <p v-if="!emergencies.length" class="staff-unavailable-state">No emergency cases were returned.</p>
            <p class="staff-section-description">This case list does not dispatch emergency services.</p>
          </section>
        </template>

        <template v-else-if="activeSectionId === 'notifications'">
          <section class="staff-section">
            <div class="staff-section-heading">
              <div><span class="staff-eyebrow">UPDATES</span><h2>Notifications</h2></div>
              <button class="button button-secondary" type="button" :disabled="isMarkingRead || !notifications.some(item => item.unread)" @click="markAllRead">
                {{ isMarkingRead ? "Updating…" : "Mark all read" }}
              </button>
            </div>
            <ul class="staff-record-list">
              <li v-for="item in notifications" :key="item.id">
                <strong>{{ item.title }}</strong><span>{{ item.message }}<template v-if="item.unread"> · Unread</template></span>
              </li>
            </ul>
            <p v-if="!notifications.length" class="staff-unavailable-state">No notifications were returned.</p>
          </section>
        </template>

        <template v-else-if="activeSectionId === 'profile'">
          <section class="staff-section">
            <div class="staff-section-heading"><div><span class="staff-eyebrow">ACCOUNT</span><h2>My profile</h2></div></div>
            <p>{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
            <p>{{ auth.user?.email || auth.user?.username }}</p>
            <p>Role: {{ auth.user?.backendRole || "Staff" }}</p>
          </section>
        </template>

        <template v-else-if="activeSectionId === 'settings'">
          <section class="staff-section">
            <div class="staff-section-heading"><div><span class="staff-eyebrow">SETTINGS</span><h2>Workspace settings</h2></div></div>
            <p class="staff-unavailable-state">The backend does not currently expose a staff settings or notification-preferences endpoint.</p>
          </section>
        </template>

        <footer class="staff-footer">
          <span>MediQueue · Hospital staff workspace</span>
          <span>Live operational data · Backend authorization enforced</span>
        </footer>
      </main>
    </div>
  </div>
</template>
