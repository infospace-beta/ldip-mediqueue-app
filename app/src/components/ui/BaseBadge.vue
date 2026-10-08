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
  neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100",
  success:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  danger: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};
</script>
