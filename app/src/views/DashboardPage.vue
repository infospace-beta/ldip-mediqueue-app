<script setup>
import { onMounted, ref } from "vue";
import {
  ArrowRight,
  Bell,
  CalendarDays,

  MapPin,
  TicketCheck,
} from "@lucide/vue";
import {
  appointments,
  notifications,
  patient,
  queue,
  unreadCount,
  clearPatientQueue,
  setPatientQueue,
} from "../data/patient";
import { useAuthStore } from "@/stores/auth.store";
import { mediqueueService } from "@/services/mediqueue.service";
import patientCareImage from "../assets/images/iwaria-inc-q7PY6bXbmzk-unsplash.jpg";

const auth = useAuthStore();
const isLoading = ref(true);
const dashboardError = ref("");

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Date unavailable";
}

function formatTime(value) {
  return value ? new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }) : "";
}

async function loadDashboard() {
  const patientId = auth.user?.id;
  if (!patientId) {
    dashboardError.value = "Your patient account could not be identified.";
    isLoading.value = false;
    return;
  }

  try {
    const profile = await mediqueueService.getPatient(patientId);
    Object.assign(patient, {
      id: String(profile.id),
      username: profile.username,
      name: profile.fullName,
      email: profile.email,
    });

    const [appointmentResult, notificationResult, visitResult] =
      await Promise.allSettled([
        mediqueueService.getPatientAppointments(patientId),
        mediqueueService.getNotifications(),
        mediqueueService.getPatientVisits(patientId),
      ]);
    const failedSections = [];

    if (appointmentResult.status === "fulfilled") {
      appointments.splice(
        0,
        appointments.length,
        ...appointmentResult.value.map((item) => ({
          id: item.id,
          doctor: item.doctorName,
          specialty: item.departmentName,
          date: formatDate(item.startsAt),
          time: formatTime(item.startsAt),
          hospital: item.hospitalName,
          status: item.status,
          startsAt: item.startsAt,
          reason: item.reason,
        })),
      );
    } else {
      failedSections.push("appointments");
    }

    if (notificationResult.status === "fulfilled") {
      notifications.splice(
        0,
        notifications.length,
        ...notificationResult.value.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          time: formatDate(item.createdAt),
          kind: item.kind,
          unread: item.unread,
        })),
      );
    } else {
      failedSections.push("notifications");
    }

    if (visitResult.status === "fulfilled") {
      const activeTicket = visitResult.value.find(
        (ticket) => ticket.status === "WAITING" || ticket.status === "CALLED",
      );
      if (activeTicket) setPatientQueue(activeTicket);
      else clearPatientQueue();
    } else {
      failedSections.push("queue status");
    }

    dashboardError.value = failedSections.length
      ? `Some live data could not be loaded: ${failedSections.join(", ")}.`
      : "";
  } catch (error) {
    dashboardError.value =
      error instanceof Error ? error.message : "Unable to load your dashboard.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void loadDashboard();
});
</script>

<template>
  <div class="dashboard-page">
    <section class="welcome-strip">
      <div class="welcome-copy">
        <span class="eyebrow">PATIENT PORTAL</span>
        <h1>
          {{
            patient.name ? `Welcome, ${patient.name}` : "Your care at a glance"
          }}
        </h1>
        <p>
          Review your live queue, appointments, and care updates.
        </p>
      </div>
      <img
        class="dashboard-welcome-image"
        :src="patientCareImage"
        alt="A nurse caring for a patient with a family member nearby"
        width="176"
        height="112"
        decoding="async"
      />
    </section>
    <p v-if="isLoading" class="dashboard-load-state" role="status">
      Loading your live care information…
    </p>
    <p v-if="dashboardError" class="form-message form-error" role="alert">
      {{ dashboardError }}
    </p>

    <div class="dashboard-main-grid">
      <div class="dashboard-primary-column">
        <section class="panel queue-overview" aria-labelledby="queue-heading">
          <div class="panel-header">
            <div>
              <span class="eyebrow">QUEUE STATUS</span>
              <h2 id="queue-heading">Current queue</h2>
            </div>
            <RouterLink
              v-if="queue.active"
              class="text-link"
              to="/patient/queue"
            >
              View queue <ArrowRight :size="15" aria-hidden="true" />
            </RouterLink>
          </div>

          <div v-if="queue.active" class="queue-summary">
            <div class="queue-summary-location">
              <span class="summary-icon"
                ><MapPin :size="18" aria-hidden="true"
              /></span>
              <div>
                <strong>{{
                  queue.hospital || "Hospital not available"
                }}</strong>
                <span v-if="queue.department || queue.service">
                  {{
                    [queue.department, queue.service]
                      .filter(Boolean)
                      .join(" · ")
                  }}
                </span>
              </div>
            </div>
            <dl
              v-if="
                queue.number ||
                queue.position > 0 ||
                queue.ahead > 0 ||
                queue.wait > 0
              "
              class="queue-facts"
            >
              <div v-if="queue.number">
                <dt>Queue number</dt>
                <dd>
                  <TicketCheck :size="16" aria-hidden="true" />
                  {{ queue.number }}
                </dd>
              </div>
              <div v-if="queue.position > 0">
                <dt>Position</dt>
                <dd>{{ queue.position }}</dd>
              </div>
              <div v-if="queue.ahead > 0">
                <dt>People ahead</dt>
                <dd>{{ queue.ahead }}</dd>
              </div>
              <div v-if="queue.wait > 0">
                <dt>Estimated wait</dt>
                <dd>{{ queue.wait }} min</dd>
              </div>
            </dl>
            <p
              v-if="
                !queue.number && !queue.position && !queue.ahead && !queue.wait
              "
              class="supporting-copy"
            >
              Your queue ticket is active. The service has not provided a
              position or estimated wait.
            </p>
            <RouterLink class="button button-secondary" to="/patient/queue">
              View queue <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </div>

          <div v-else class="dashboard-empty-state">
            <div>
              <strong>No active queue</strong>
              <p>
                No active queue ticket was found for your account.
              </p>
            </div>
            <RouterLink class="button button-primary" to="/patient/join-queue">
              Prepare a queue request
              <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </div>
        </section>

        <section
          class="panel appointments-preview"
          aria-labelledby="appointments-heading"
        >
          <div class="panel-header">
            <div>
              <span class="eyebrow">APPOINTMENTS</span>
              <h2 id="appointments-heading">Appointments</h2>
            </div>
            <RouterLink class="text-link" to="/patient/appointments">
              View appointments <ArrowRight :size="15" aria-hidden="true" />
            </RouterLink>
          </div>
          <ul v-if="appointments.length" class="dashboard-appointment-list">
            <li
              v-for="appointment in appointments"
              :key="appointment.id"
              class="appointment-preview-row"
            >
              <CalendarDays :size="18" aria-hidden="true" />
              <div class="appointment-details">
                <strong>{{
                  appointment.doctor || appointment.specialty || "Appointment"
                }}</strong>
                <span v-if="appointment.hospital">{{
                  appointment.hospital
                }}</span>
                <span v-if="appointment.date || appointment.time">
                  {{
                    [appointment.date, appointment.time]
                      .filter(Boolean)
                      .join(" · ")
                  }}
                </span>
              </div>
              <span v-if="appointment.status" class="appointment-status">{{
                appointment.status
              }}</span>
            </li>
          </ul>
          <p v-else class="supporting-copy">
            {{ isLoading ? "Loading appointments…" : "No appointments found." }}
          </p>
        </section>
      </div>

      <aside
        class="dashboard-side-column"
        aria-label="Patient updates and actions"
      >
        <section
          class="panel notification-summary"
          aria-labelledby="notifications-heading"
        >
          <div class="panel-header">
            <div>
              <span class="eyebrow">UPDATES</span>
              <h2 id="notifications-heading">Notifications</h2>
            </div>
            <Bell :size="18" aria-hidden="true" />
          </div>
          <p v-if="notifications.length && unreadCount()">
            {{ unreadCount() }} unread
            {{ unreadCount() === 1 ? "notification" : "notifications" }}.
          </p>
          <p v-else-if="notifications.length" class="supporting-copy">
            No unread notifications among {{ notifications.length }} available
            {{ notifications.length === 1 ? "update" : "updates" }}.
          </p>
          <p v-else class="supporting-copy">
            {{ isLoading ? "Loading notifications…" : "No notifications found." }}
          </p>
          <RouterLink class="text-link" to="/patient/notifications">
            View notifications <ArrowRight :size="15" aria-hidden="true" />
          </RouterLink>
        </section>

        <nav class="panel quick-actions" aria-label="Quick actions">
          <span class="eyebrow">YOUR CARE</span>
          <RouterLink to="/patient/history"
            >Medical history <ArrowRight :size="15" aria-hidden="true"
          /></RouterLink>
          <RouterLink to="/patient/profile"
            >My profile <ArrowRight :size="15" aria-hidden="true"
          /></RouterLink>
          <RouterLink to="/patient/settings"
            >Settings <ArrowRight :size="15" aria-hidden="true"
          /></RouterLink>
          <RouterLink to="/patient/emergency"
            >Emergency information <ArrowRight :size="15" aria-hidden="true"
          /></RouterLink>
        </nav>
      </aside>
    </div>
  </div>
</template>
