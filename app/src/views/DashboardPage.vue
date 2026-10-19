<script setup>
import { ArrowRight, Bell, CalendarDays, Clock3, MapPin, TicketCheck } from '@lucide/vue'
import { appointments, notifications, patient, queue, unreadCount } from '../data/patient'
</script>

<template>
  <div class="dashboard-page">
    <section class="welcome-strip">
      <div>
        <span class="eyebrow">PATIENT PORTAL</span>
        <h1>{{ patient.name ? `Welcome, ${patient.name}` : 'Welcome to your care dashboard' }}</h1>
        <p>Review your queue and appointment information, or choose a next step.</p>
      </div>
    </section>

    <div class="dashboard-main-grid">
      <div class="dashboard-primary-column">
        <section class="panel queue-overview" aria-labelledby="queue-heading">
          <div class="panel-header">
            <div>
              <span class="eyebrow">QUEUE</span>
              <h2 id="queue-heading">Current queue</h2>
            </div>
            <RouterLink v-if="queue.active" class="text-link" to="/patient/queue">
              Queue details <ArrowRight :size="15" aria-hidden="true" />
            </RouterLink>
          </div>

          <div v-if="queue.active" class="queue-summary">
            <div class="queue-summary-location">
              <span class="summary-icon"><MapPin :size="18" aria-hidden="true" /></span>
              <div>
                <strong>{{ queue.hospital || 'Hospital not available' }}</strong>
                <span v-if="queue.department || queue.service">
                  {{ [queue.department, queue.service].filter(Boolean).join(' · ') }}
                </span>
              </div>
            </div>
            <dl v-if="queue.number || queue.position > 0 || queue.ahead > 0 || queue.wait > 0" class="queue-facts">
              <div v-if="queue.number">
                <dt>Queue number</dt>
                <dd><TicketCheck :size="16" aria-hidden="true" /> {{ queue.number }}</dd>
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
            <p v-if="!queue.number && !queue.position && !queue.ahead && !queue.wait" class="supporting-copy">
              Queue information is recorded in this session. Live hospital status is not connected.
            </p>
            <RouterLink class="button button-secondary" to="/patient/queue">
              View queue <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </div>

          <div v-else class="dashboard-empty-state">
            <div>
              <strong>No active queue</strong>
              <p>Join a queue when you are ready to find care.</p>
            </div>
            <RouterLink class="button button-primary" to="/patient/join-queue">
              Join a queue <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </div>
        </section>

        <section class="panel appointments-preview" aria-labelledby="appointments-heading">
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
            <li v-for="appointment in appointments" :key="appointment.id" class="appointment-preview-row">
              <CalendarDays :size="18" aria-hidden="true" />
              <div class="appointment-details">
                <strong>{{ appointment.doctor || appointment.specialty || 'Appointment' }}</strong>
                <span v-if="appointment.hospital">{{ appointment.hospital }}</span>
                <span v-if="appointment.date || appointment.time">
                  {{ [appointment.date, appointment.time].filter(Boolean).join(' · ') }}
                </span>
              </div>
              <span v-if="appointment.status" class="appointment-status">{{ appointment.status }}</span>
            </li>
          </ul>
          <p v-else class="supporting-copy">
            No appointment information is available in this session.
          </p>
        </section>
      </div>

      <aside class="dashboard-side-column" aria-label="Patient updates and actions">
        <section class="panel notification-summary" aria-labelledby="notifications-heading">
          <div class="panel-header">
            <div>
              <span class="eyebrow">UPDATES</span>
              <h2 id="notifications-heading">Notifications</h2>
            </div>
            <Bell :size="18" aria-hidden="true" />
          </div>
          <p v-if="notifications.length">
            {{ unreadCount() }} unread {{ unreadCount() === 1 ? 'notification' : 'notifications' }}.
          </p>
          <p v-else class="supporting-copy">
            No notification information is available in this session.
          </p>
          <RouterLink class="text-link" to="/patient/notifications">
            View notifications <ArrowRight :size="15" aria-hidden="true" />
          </RouterLink>
        </section>

        <nav class="panel quick-actions" aria-label="Quick actions">
          <span class="eyebrow">QUICK ACTIONS</span>
          <RouterLink to="/patient/join-queue">Join a queue <ArrowRight :size="15" aria-hidden="true" /></RouterLink>
          <RouterLink to="/patient/appointments">Appointments <ArrowRight :size="15" aria-hidden="true" /></RouterLink>
          <RouterLink to="/patient/profile">My profile <ArrowRight :size="15" aria-hidden="true" /></RouterLink>
          <RouterLink to="/patient/emergency">Emergency information <ArrowRight :size="15" aria-hidden="true" /></RouterLink>
        </nav>
      </aside>
    </div>
  </div>
</template>
