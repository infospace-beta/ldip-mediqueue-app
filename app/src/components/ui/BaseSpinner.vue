<template>
  <span
    class="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
    :class="SIZES[size]"
    role="status"
    aria-label="Loading"
  />
</template>

<script setup lang="ts">
type SpinnerSize = "sm" | "md" | "lg";

withDefaults(defineProps<{ size?: SpinnerSize }>(), { size: "sm" });

const SIZES: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};
</script>
