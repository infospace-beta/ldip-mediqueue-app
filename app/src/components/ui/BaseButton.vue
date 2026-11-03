<template>
  <button :type="type" :class="classes" :disabled="disabled || loading">
    <BaseSpinner v-if="loading" class="mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";

/**
 * The single place button styling lives. Add a variant here rather than
 * pasting Tailwind class strings into a view.
 */
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    type: "button",
    disabled: false,
    loading: false,
    block: false,
  },
);

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary:
    "border border-[var(--app-border)] bg-[var(--app-surface-muted)] text-[var(--app-text-primary)] hover:bg-[var(--app-hover-surface)]",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  ghost:
    "border border-[var(--app-border)] bg-transparent text-[var(--app-text-primary)] hover:bg-[var(--app-hover-surface)]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-2 px-4 text-sm",
  lg: "py-3 px-6 text-lg",
};

const classes = computed(() => [
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-focus)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  VARIANTS[props.variant],
  SIZES[props.size],
  props.block ? "w-full" : "",
]);
</script>
