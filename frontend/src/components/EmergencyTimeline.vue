<script setup lang="ts">
defineProps<{
  timeline: Array<{ time: string; event: string }>
}>()
</script>

<template>
  <div class="timeline">
    <div v-for="item in timeline" :key="`${item.time}-${item.event}`" class="timeline__item">
      <span class="timeline__dot" aria-hidden="true"></span>
      <div>
        <strong>{{ item.time }}</strong>
        <p>{{ item.event }}</p>
      </div>
    </div>
  </div>
</template>
