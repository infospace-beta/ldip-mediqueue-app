<script setup>
import { ArrowRight, Bell, CalendarDays, Clock3, HeartPulse, ShieldPlus, UsersRound } from '@lucide/vue'
import SummaryCard from '../components/SummaryCard.vue'
import QueueCard from '../components/QueueCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { activities, appointments, emergencyRequests, medicalHistory, notifications, patient, queue } from '../data/patient'
</script>

<template>
  <div class="dashboard-page">
    <section class="welcome-strip">
      <div><span class="eyebrow">YOUR HEALTH â€¢ OUR PRIORITY</span><h1>Welcome back, {{ patient.name || 'Patient' }}</h1><p>Your care overview. Live information will appear here when connected.</p></div>
      <div class="welcome-date"><span class="welcome-date-icon"><HeartPulse :size="18" /></span><span><strong>MEDIQUEUE</strong><small>Patient ID: {{ patient.id || 'â€”' }}</small></span></div>
    </section>

    <section class="overview-grid" aria-label="Patient overview">
      <SummaryCard title="Queue Position" :value="queue.position" description="Current position" :icon="Clock3" />
      <SummaryCard title="Estimated Waiting Time" :value="queue.wait" unit="minutes" description="Estimated wait" tone="blue" :icon="Clock3" />
      <SummaryCard title="Upcoming Appointments" :value="appointments.length" description="Scheduled appointments" tone="amber" :icon="CalendarDays" />
      <SummaryCard title="Notifications" :value="notifications.length" description="New patient updates" tone="green" :icon="Bell" />
      <SummaryCard title="Emergency Requests" :value="emergencyRequests.length" description="Active requests" tone="amber" :icon="ShieldPlus" />
      <SummaryCard title="Completed Visits" :value="medicalHistory.length" description="Previous visits" tone="blue" :icon="HeartPulse" />
    </section>

    <div class="dashboard-main-grid">
      <div class="dashboard-primary-column">
        <QueueCard />
        <section class="panel appointments-preview">
          <div class="panel-header"><div><span class="eyebrow">APPOINTMENTS</span><h2>Upcoming appointments <span class="inline-count">{{ appointments.length }}</span></h2></div><RouterLink class="text-link" to="/patient/appointments">View appointments <ArrowRight :size="15" /></RouterLink></div>
          <div v-if="appointments.length" class="dashboard-appointment-list"><article v-for="appointment in appointments" :key="appointment.id" class="appointment-preview-row"><span class="doctor-avatar">{{ appointment.initials || 'P' }}</span><div class="doctor-details"><strong>{{ appointment.doctor || 'Doctor details unavailable' }}</strong><span>{{ appointment.specialty || 'Department unavailable' }} Â· {{ appointment.hospital || 'Hospital pending' }}</span></div><div class="appointment-when"><span>{{ appointment.date || 'Date pending' }}</span><strong>{{ appointment.time || 'Time pending' }}</strong></div><StatusBadge :status="appointment.status || 'Pending'" /></article></div>
          <div v-else class="empty-inline-state"><CalendarDays :size="19" /><span>No upcoming appointments</span><RouterLink to="/patient/appointments">Book Appointment</RouterLink></div>
        </section>
      </div>
      <div class="dashboard-side-column">
        <RouterLink to="/patient/emergency" class="emergency-quick-link"><span class="emergency-symbol"><HeartPulse :size="21" /></span><span><strong>Emergency assistance</strong><small>Emergency requests: {{ emergencyRequests.length }}</small></span><ArrowRight :size="17" /></RouterLink>
        <section class="panel activity-panel">
          <div class="panel-header"><div><span class="eyebrow">YOUR JOURNEY</span><h2>Recent activity</h2></div><span class="activity-unread">{{ activities.length }}</span></div>
          <div v-if="activities.length" class="activity-list"><article v-for="activity in activities" :key="activity.title" class="activity-item"><span class="activity-icon"><UsersRound :size="15" /></span><span class="activity-copy"><strong>{{ activity.title }}</strong><small>{{ activity.detail }}</small><time>{{ activity.time }}</time></span></article></div>
          <div v-else class="empty-inline-state"><Clock3 :size="19" /><span>No recent activity</span></div>
          <RouterLink to="/patient/notifications" class="panel-bottom-link">View notifications <ArrowRight :size="14" /></RouterLink>
        </section>
        <section class="health-note"><span class="health-note-icon"><ShieldPlus :size="19" /></span><div><strong>Your care information</strong><p>Medical history: {{ medicalHistory.length }} records Â· Emergency status: No active request</p></div></section>
      </div>
    </div>
  </div>
</template>

