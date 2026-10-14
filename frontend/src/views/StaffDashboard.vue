<script setup lang="ts">
import { ref } from 'vue'
import SummaryCard from '../components/SummaryCard.vue'
import QueueTable from '../components/QueueTable.vue'
import CurrentPatient from '../components/CurrentPatient.vue'
import NextPatient from '../components/NextPatient.vue'
import EmergencyAlert from '../components/EmergencyAlert.vue'
import NotificationPanel from '../components/NotificationPanel.vue'
import PatientRegistration from '../components/PatientRegistration.vue'
import Button from '../components/Button.vue'
import { notifications, patients, summaryMetrics } from '../data/mockData'

const registrationOpen = ref(false)
const queuePatients = patients.slice(0, 4)
const currentPatient = patients[0] ?? null
</script>

<template>
  <div class="page-shell__content">
    <section class="summary-grid">
      <SummaryCard
        v-for="metric in summaryMetrics"
        :key="metric.label"
        :label="metric.label"
        :value="metric.value"
        :trend="metric.trend"
        :tone="metric.tone"
        :icon="metric.label.includes('Waiting') ? '👥' : metric.label.includes('Consultation') ? '🩺' : metric.label.includes('Emergency') ? '🚨' : '✅'"
      />
    </section>

    <section class="dashboard-layout">
      <div class="dashboard-main">
        <div class="panel panel--compact">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Patient queue</p>
              <h3>Queue overview</h3>
            </div>
            <div class="toolbar">
              <select class="select-lite" aria-label="Department">
                <option>Cardiology</option>
              </select>
              <Button variant="secondary" @click="registrationOpen = true">Register patient</Button>
            </div>
          </div>

          <div class="filter-row">
            <button type="button" class="chip chip--active">All Queues</button>
            <button type="button" class="chip">Waiting</button>
            <button type="button" class="chip">In Consultation</button>
            <button type="button" class="chip">Completed</button>
            <button type="button" class="chip">Priority</button>
            <button type="button" class="chip">Emergency</button>
          </div>

          <QueueTable :patients="queuePatients" />
        </div>

        <div v-if="currentPatient" class="two-column-panel">
          <CurrentPatient :patient="currentPatient" />
          <NextPatient />
        </div>

        <div v-else class="empty-state empty-state--large">
          <p>No active patient currently in consultation.</p>
        </div>

        <div class="panel progress-panel">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Queue progress</p>
              <h3>Cardiology</h3>
            </div>
            <div class="progress-metric">0 / 0</div>
          </div>
          <div class="progress-bar" aria-label="Queue progress">
            <span :style="{ width: '0%' }"></span>
          </div>
          <div class="progress-meta">
            <p>0 of 0 patients seen</p>
            <p>Estimated wait: 0 minutes</p>
          </div>
        </div>
      </div>

      <aside class="dashboard-side">
        <EmergencyAlert />
        <NotificationPanel :notifications="notifications" />
      </aside>
    </section>

    <PatientRegistration :open="registrationOpen" @close="registrationOpen = false" />
  </div>
</template>
