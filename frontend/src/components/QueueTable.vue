<script setup lang="ts">
import type { Patient } from '../types'
import StatusBadge from './StatusBadge.vue'

defineProps<{
  patients: Patient[]
}>()
</script>

<template>
  <div v-if="patients.length === 0" class="empty-state">
    <p>No patients are currently waiting.</p>
  </div>

  <div v-else class="queue-table-wrap">
    <table class="queue-table">
      <thead>
        <tr>
          <th>Queue Number</th>
          <th>Patient</th>
          <th>MRN</th>
          <th>Age</th>
          <th>Department</th>
          <th>Priority</th>
          <th>Waiting Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in patients" :key="patient.id">
          <td class="queue-number">{{ patient.queueNumber }}</td>
          <td>
            <div class="patient-cell">
              <div class="patient-cell__avatar">{{ patient.name.split(' ').map((p) => p[0]).slice(0, 2).join('') }}</div>
              <div>
                <strong>{{ patient.name }}</strong>
              </div>
            </div>
          </td>
          <td>{{ patient.mrn }}</td>
          <td>{{ patient.age }}</td>
          <td>{{ patient.department }}</td>
          <td>{{ patient.priority }}</td>
          <td>{{ patient.waitingMinutes }} min</td>
          <td><StatusBadge :status="patient.status" /></td>
          <td>
            <div class="table-actions">
              <button type="button" class="table-action table-action--primary">View</button>
              <button type="button" class="table-action table-action--ghost">Call</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
