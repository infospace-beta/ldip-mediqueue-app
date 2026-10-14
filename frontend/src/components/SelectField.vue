<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label: string
    options: Array<{ label: string; value: string }>
    required?: boolean
    error?: string
    disabled?: boolean
  }>(),
  {
    required: false,
    error: '',
    disabled: false,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function onChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <label class="field">
    <span class="field__label">{{ label }} <em v-if="required">*</em></span>
    <select :value="modelValue ?? ''" :disabled="disabled" :aria-invalid="Boolean(error)" @change="onChange">
      <option value="">Select</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <small v-if="error" class="field__error">{{ error }}</small>
  </label>
</template>
