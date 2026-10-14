<script setup>
import { ref } from 'vue'
import { CalendarDays, Clock3, MapPin, Stethoscope } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { appointments } from '../data/patient'
import StatusBadge from '../components/StatusBadge.vue'

const router = useRouter()
const bookingNotice = ref(false)
</script>

<template>
  <div class="section-page">
    <div class="page-heading"><div><span class="eyebrow">PLAN YOUR CARE</span><h1>Appointments</h1><p>Upcoming Appointments: {{ appointments.length }}</p></div><button class="button button-primary" type="button" @click="bookingNotice = true"><CalendarDays :size="16" /> Book Appointment</button></div>
    <output v-if="bookingNotice" class="form-message form-success">Appointment booking will be available when the scheduling service is connected.</output>
    <div v-if="appointments.length" class="appointment-list">
      <article v-for="appointment in appointments" :key="appointment.id" class="panel appointment-card">
        <div class="appointment-card-main"><div class="appointment-doctor"><span class="doctor-avatar">{{ appointment.initials || 'P' }}</span><div><strong>{{ appointment.doctor || 'Doctor details unavailable' }}</strong><span><Stethoscope :size="14" /> {{ appointment.specialty || 'Department unavailable' }}</span></div></div><div class="appointment-facts"><span><CalendarDays :size="15" /> {{ appointment.date || 'Date pending' }}</span><span><Clock3 :size="15" /> {{ appointment.time || 'Time pending' }}</span><span><MapPin :size="15" /> {{ appointment.hospital || 'Hospital pending' }}</span></div></div><StatusBadge :status="appointment.status || 'Pending'" />
      </article>
    </div>
    <section v-else class="panel empty-state"><span class="empty-state-icon"><CalendarDays :size="24" /></span><h2>No upcoming appointments</h2><p>Upcoming Appointments: 0</p><button class="button button-primary" type="button" @click="bookingNotice = true">Book Appointment</button></section>
    <section class="panel appointment-note"><Clock3 :size="17" /><span>Appointment details will appear here when connected to your care provider.</span></section>
  </div>
</template>