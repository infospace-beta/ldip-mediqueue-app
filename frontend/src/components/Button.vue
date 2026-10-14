<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
)
</script>

<template>
  <button
    type="button"
    class="ui-button"
    :class="[`ui-button--${variant}`, `ui-button--${size}`, { 'ui-button--full': fullWidth, 'ui-button--loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="ui-button__spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>
