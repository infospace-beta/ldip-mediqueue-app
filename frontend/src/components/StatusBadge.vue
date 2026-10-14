<<<<<<< HEAD
<script setup>
defineProps({ status: { type: String, default: 'Waiting' } })
</script>

<template>
  <span class="status-badge" :class="`status-${status.toLowerCase().replaceAll(' ', '-')}`">
    <span class="status-dot"></span>{{ status }}
  </span>
=======
<script setup lang="ts">
withDefaults(
  defineProps<{
    status: string
  }>(),
  {
    status: 'Waiting',
  },
)

const statusClassMap: Record<string, string> = {
  Waiting: 'badge--waiting',
  Called: 'badge--called',
  'In Consultation': 'badge--consultation',
  Delayed: 'badge--delayed',
  Emergency: 'badge--danger',
  Priority: 'badge--priority',
  Completed: 'badge--success',
  New: 'badge--waiting',
  Accepted: 'badge--success',
  Dispatched: 'badge--info',
  'On Scene': 'badge--warning',
  Resolved: 'badge--success',
  Escalated: 'badge--danger',
  Open: 'badge--success',
  Busy: 'badge--warning',
  'At Capacity': 'badge--danger',
}
</script>

<template>
  <span class="status-badge" :class="statusClassMap[status] || 'badge--neutral'">{{ status }}</span>
>>>>>>> origin/mediqueue/-staff
</template>
