<script setup lang="ts">
const props = defineProps<{ modelValue?: string; placeholder?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label class="search-bar" :aria-label="placeholder || 'Search'">
    <span class="search-bar__icon" aria-hidden="true">⌕</span>
    <input
      :value="props.modelValue ?? ''"
      :placeholder="placeholder || 'Search'"
      type="search"
      @input="onInput"
    />
  </label>
</template>
