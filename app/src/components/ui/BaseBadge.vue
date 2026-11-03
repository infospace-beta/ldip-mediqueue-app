<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      TONES[tone],
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger";

withDefaults(defineProps<{ tone?: BadgeTone }>(), { tone: "neutral" });

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-[var(--app-surface-muted)] text-[var(--app-text-secondary)]",
  brand: "bg-[var(--app-brand-soft)] text-[var(--app-brand-primary)]",
  success: "bg-[var(--app-success-surface)] text-[var(--app-success)]",
  warning: "bg-[var(--app-warning-surface)] text-[var(--app-warning)]",
  danger: "bg-[var(--app-error-surface)] text-[var(--app-error)]",
};
</script>
