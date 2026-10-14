<script setup lang="ts">
import type { Patient } from '../types'

defineProps<{
  patient: Patient
}>()
</script>

<template>
  <article class="patient-card panel">
    <div class="patient-card__header">
      <strong>{{ patient.name }}</strong>
      <span>{{ patient.queueNumber }}</span>
    </div>
    <ul>
      <li>MRN: {{ patient.mrn }}</li>
      <li>Age: {{ patient.age }}</li>
      <li>{{ patient.department }}</li>
    </ul>
  </article>
</template>
