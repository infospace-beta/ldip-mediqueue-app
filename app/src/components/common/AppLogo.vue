<template>
  <span class="inline-flex items-center gap-2">
    <img
      src="/logo-developers-mania.png"
      alt=""
      :class="['w-auto', SIZES[size]]"
      width="200"
      height="200"
      decoding="async"
    />
    <span v-if="withWordmark" :class="['font-semibold', TEXT[size]]">
      {{ name }}
    </span>
  </span>
</template>

<script setup lang="ts">
/**
 * The app mark. Swap the image in public/ to rebrand - nothing else references
 * it, and `alt` is empty on purpose because the wordmark beside it carries the
 * name for screen readers.
 */
type LogoSize = "sm" | "md" | "lg";

withDefaults(
  defineProps<{
    name?: string;
    size?: LogoSize;
    withWordmark?: boolean;
  }>(),
  { name: "Vue Template TS", size: "md", withWordmark: true },
);

const SIZES: Record<LogoSize, string> = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
};
const TEXT: Record<LogoSize, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
};
</script>
