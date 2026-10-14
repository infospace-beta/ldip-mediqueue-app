<<<<<<< HEAD
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
=======
<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string | number
    trend?: string
    tone?: 'primary' | 'success' | 'warning' | 'danger'
    icon?: string
  }>(),
  {
    tone: 'primary',
    icon: '•',
  },
)
</script>

<template>
  <article class="summary-card" :class="`summary-card--${tone}`">
    <div class="summary-card__content">
      <div class="summary-card__icon" aria-hidden="true">{{ icon }}</div>
      <div>
        <p class="summary-card__label">{{ label }}</p>
        <h3>{{ value }}</h3>
      </div>
    </div>
    <p v-if="trend" class="summary-card__trend">{{ trend }}</p>
  </article>
</template>
>>>>>>> origin/mediqueue/-staff
