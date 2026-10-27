<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  icon: { type: [Object, Function], default: null },
})
</script>

<template>
  <div class="responder-empty-state" role="status">
    <span class="responder-empty-icon"><component :is="icon" :size="22" :stroke-width="1.7" /></span>
    <strong>{{ title }}</strong>
    <p>{{ description }}</p>
  </div>
</template>