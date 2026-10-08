<template>
  <div class="flex flex-col items-center justify-center gap-3 py-16 muted">
    <BaseSpinner size="lg" />
    <p>{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
import BaseSpinner from "@/components/ui/BaseSpinner.vue";

withDefaults(defineProps<{ label?: string }>(), { label: "Loading..." });
</script>
