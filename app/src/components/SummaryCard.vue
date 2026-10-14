<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  unit: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: [Object, Function], required: true },
  tone: { type: String, default: 'green' },
})
</script>

<template>
  <article class="overview-card">
    <div class="overview-card-top"><span class="overview-icon" :class="`overview-icon-${tone}`"><component :is="icon" :size="18" /></span></div>
    <p>{{ title }}</p>
    <strong class="overview-value">{{ value }}<span v-if="unit"> {{ unit }}</span></strong>
    <small>{{ description }}</small>
  </article>
</template>