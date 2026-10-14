<script setup lang="ts">
import type { Patient } from '../types'
import Button from './Button.vue'

defineProps<{
  patient: Patient
}>()
</script>

<template>
  <section class="panel panel--featured">
    <div class="panel__header">
      <div>
        <p class="eyebrow">Current patient</p>
        <h3>{{ patient.name }}</h3>
      </div>
      <span class="chip chip--info">{{ patient.status }}</span>
    </div>

    <div class="detail-grid">
      <div><span>Queue Number</span><strong>{{ patient.queueNumber }}</strong></div>
      <div><span>MRN</span><strong>{{ patient.mrn }}</strong></div>
      <div><span>Age</span><strong>{{ patient.age }}</strong></div>
      <div><span>Department</span><strong>{{ patient.department }}</strong></div>
      <div><span>Waiting</span><strong>{{ patient.waitingMinutes }} min</strong></div>
      <div><span>Position</span><strong>#3</strong></div>
      <div class="detail-grid__full"><span>Status</span><strong>{{ patient.status }}</strong></div>
    </div>

    <div class="inline-actions">
      <Button variant="success">Complete Consultation</Button>
      <Button variant="secondary">Delay</Button>
      <Button variant="ghost">Return to Queue</Button>
    </div>
  </section>
</template>
