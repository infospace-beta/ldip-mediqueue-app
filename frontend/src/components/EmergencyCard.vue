<script setup lang="ts">
import type { EmergencyRequest } from '../types'
import StatusBadge from './StatusBadge.vue'

defineProps<{
  emergency: EmergencyRequest
}>()
</script>

<template>
  <article class="emergency-card">
    <div class="emergency-card__head">
      <div>
        <p class="eyebrow">Emergency Request</p>
        <h4>{{ emergency.requestNumber }}</h4>
      </div>
      <StatusBadge :status="emergency.status" />
    </div>

    <div class="emergency-card__body">
      <div class="emergency-card__info">
        <span>{{ emergency.patientType }}</span>
        <strong>{{ emergency.complaint }}</strong>
      </div>
      <div class="emergency-card__grid">
        <div><span>Reported</span><strong>{{ emergency.reportedAt }}</strong></div>
        <div><span>Assigned to</span><strong>{{ emergency.assignedTo }}</strong></div>
        <div><span>Responder</span><strong>{{ emergency.responder }}</strong></div>
        <div><span>ETA</span><strong>{{ emergency.eta }}</strong></div>
        <div class="emergency-card__wide"><span>Location</span><strong>{{ emergency.location }}</strong></div>
      </div>
    </div>
  </article>
</template>
