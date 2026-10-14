<script setup lang="ts">
import Button from './Button.vue'

withDefaults(
  defineProps<{
    queueNumber?: string
    patientName?: string
    department?: string
    estimatedWait?: string
  }>(),
  {
    queueNumber: 'A-025',
    patientName: 'John Kamau',
    department: 'Cardiology',
    estimatedWait: '5 minutes',
  },
)
</script>

<template>
  <section class="panel panel--subtle">
    <div class="panel__header panel__header--stacked">
      <div>
        <p class="eyebrow">Next patient</p>
        <h3>{{ patientName }}</h3>
      </div>
      <span class="chip chip--success">Queue {{ queueNumber }}</span>
    </div>

    <div class="next-patient__details">
      <div>
        <span>Department</span>
        <strong>{{ department }}</strong>
      </div>
      <div>
        <span>Estimated wait</span>
        <strong>{{ estimatedWait }}</strong>
      </div>
    </div>

    <div class="inline-actions">
      <Button variant="success">Call Next Patient</Button>
      <Button variant="secondary">Skip Patient</Button>
    </div>
  </section>
</template>
