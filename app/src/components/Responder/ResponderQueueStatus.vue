<script setup>
const props = defineProps({ waiting: Number, inProgress: Number, completed: Number })
const statuses = [
  { key: 'waiting', label: 'Waiting' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
] 
</script>

<template>
  <section class="responder-panel responder-queue-panel" aria-labelledby="queue-status-heading">
    <div class="responder-panel-heading"><div><span class="responder-eyebrow">LIVE OVERVIEW</span><h2 id="queue-status-heading">Queue status</h2></div><span class="responder-live-label"><i></i> LIVE</span></div>
    <div class="responder-queue-metrics">
      <div v-for="item in statuses" :key="item.key" class="responder-queue-metric">
        <span class="responder-queue-label"><i :class="`queue-${item.key}`"></i>{{ item.label }}</span>
        <strong>{{ props[item.key] }}</strong>
      </div>
    </div>
    <div class="responder-queue-footnote">Queue data will appear when connected.</div>
  </section>
</template>