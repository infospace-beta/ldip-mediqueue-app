<script setup>
import { ref } from "vue";
import { CalendarDays, Clock3, MapPin, Stethoscope } from "@lucide/vue";
import { useRouter } from "vue-router";
import { appointments } from "../data/patient";
import StatusBadge from "../components/StatusBadge.vue";

const router = useRouter();
const bookingNotice = ref(false);
</script>

<template>
  <div class="section-page appointments-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">VISIT SCHEDULE</span>
        <h1>Appointments</h1>
        <p>
          Review appointment information held in this browser session. Live
          scheduling is not connected.
        </p>
      </div>
      <button
        class="button button-primary"
        type="button"
        @click="bookingNotice = true"
      >
        <CalendarDays :size="17" aria-hidden="true" /> Check booking status
      </button>
    </div>
    <output
      v-if="bookingNotice"
      class="form-message service-notice"
      role="status"
      >Appointment scheduling is not connected. No appointment has been
      booked.</output
    >
    <div v-if="appointments.length" class="appointment-list">
      <article
        v-for="appointment in appointments"
        :key="appointment.id"
        class="panel appointment-card"
      >
        <div class="appointment-card-main">
          <div class="appointment-doctor">
            <span class="doctor-avatar">{{ appointment.initials || "P" }}</span>
            <div>
              <strong>{{
                appointment.doctor || "Doctor details unavailable"
              }}</strong
              ><span
                ><Stethoscope :size="14" />
                {{ appointment.specialty || "Department unavailable" }}</span
              >
            </div>
          </div>
          <div class="appointment-facts">
            <span
              ><CalendarDays :size="15" />
              {{ appointment.date || "Date pending" }}</span
            ><span
              ><Clock3 :size="15" />
              {{ appointment.time || "Time pending" }}</span
            ><span
              ><MapPin :size="15" />
              {{ appointment.hospital || "Hospital pending" }}</span
            >
          </div>
        </div>
        <StatusBadge :status="appointment.status || 'Pending'" />
      </article>
    </div>
    <section v-else class="panel empty-state">
      <span class="empty-state-icon"
        ><CalendarDays :size="23" aria-hidden="true"
      /></span>
      <h2>No appointment information available</h2>
      <p>
        Appointment details will appear here when your care provider's
        scheduling service is connected.
      </p>
      <button
        class="button button-secondary"
        type="button"
        @click="bookingNotice = true"
      >
        Check booking status
      </button>
    </section>
    <p class="appointment-note">
      <Clock3 :size="16" aria-hidden="true" /><span
        >Booking and appointment changes are not connected to a scheduling
        service.</span
      >
    </p>
  </div>
</template>
