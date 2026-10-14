<script setup>
defineProps({ status: { type: String, default: 'Waiting' } })
</script>

<template>
  <span class="status-badge" :class="`status-${status.toLowerCase().replaceAll(' ', '-')}`">
    <span class="status-dot"></span>{{ status }}
  </span>
</template>
