<script setup lang="ts">
import type { DoctorAppointment } from "./doctorDashboard.types";

defineProps<{ appointments: readonly DoctorAppointment[] }>();
</script>

<template>
  <div class="doctor-table-scroll">
    <table class="doctor-table">
      <thead>
        <tr>
          <th scope="col">Time</th>
          <th scope="col">Patient</th>
          <th scope="col">Visit type</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appointment in appointments" :key="appointment.id">
          <td class="doctor-time-cell">{{ appointment.time }}</td>
          <td>
            <span class="doctor-table-person">
              <span class="doctor-queue-avatar" aria-hidden="true">{{
                appointment.patientName.slice(0, 1)
              }}</span>
              <span>
                <strong>{{ appointment.patientName }}</strong>
                <small class="doctor-id-cell">{{
                  appointment.patientId
                }}</small>
              </span>
            </span>
          </td>
          <td>{{ appointment.visitType }}</td>
          <td>
            <span
              class="doctor-status"
              :class="`status-${appointment.status.toLowerCase().replaceAll(' ', '-')}`"
            >
              {{ appointment.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="appointments.length === 0" class="doctor-empty-state">
      Appointment data is unavailable until the clinical service is connected.
    </p>
  </div>
</template>
