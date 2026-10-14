<script setup>
defineProps({ label: String, value: Number, detail: String, icon: Object, tone: String })
</script>

<template>
  <article class="responder-stat-card">
    <div class="responder-stat-top"><span class="responder-stat-icon" :class="`tone-${tone}`"><component :is="icon" :size="19" /></span><span class="responder-stat-period">CURRENT</span></div>
    <p>{{ label }}</p>
    <strong class="responder-stat-value">{{ value }}</strong>
    <small>{{ detail }}</small>
  </article>
</template>