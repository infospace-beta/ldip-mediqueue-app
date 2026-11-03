<template>
  <div
    class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--app-border)] py-16 text-center text-[var(--app-text-primary)]"
  >
    <p class="text-lg font-medium">{{ title }}</p>
    <p v-if="description" class="max-w-sm muted">{{ description }}</p>
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string }>(), {
  title: "Nothing here yet",
});
</script>
