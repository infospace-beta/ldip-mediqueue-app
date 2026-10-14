<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    detail?: string
  }>(),
  {
    title: 'New Critical Emergency Request',
    detail: 'North entrance · Immediate response required',
  },
)
</script>

<template>
  <aside class="emergency-alert" role="alert">
    <div class="emergency-alert__icon" aria-hidden="true">⚠</div>
    <div>
      <h4>{{ title }}</h4>
      <p>{{ detail }}</p>
    </div>
  </aside>
</template>
