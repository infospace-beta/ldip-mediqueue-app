<script setup lang="ts">
import type { Department } from '../types'
import StatusBadge from './StatusBadge.vue'

defineProps<{
  department: Department
}>()
</script>

<template>
  <article class="department-card">
    <div class="department-card__top">
      <h4>{{ department.name }}</h4>
      <StatusBadge :status="department.status" />
    </div>
    <div class="department-card__stats">
      <div><span>Waiting</span><strong>{{ department.waiting }}</strong></div>
      <div><span>In consultation</span><strong>{{ department.inConsultation }}</strong></div>
      <div><span>Emergency</span><strong>{{ department.emergencyCases }}</strong></div>
      <div><span>Doctors</span><strong>{{ department.doctorsAvailable }}</strong></div>
    </div>
  </article>
</template>
