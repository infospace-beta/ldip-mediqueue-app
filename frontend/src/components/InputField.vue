<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string | number
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    error?: string
    disabled?: boolean
  }>(),
  {
    type: 'text',
    required: false,
    error: '',
    disabled: false,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label class="field">
    <span class="field__label">{{ label }} <em v-if="required">*</em></span>
    <input
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder || ''"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      @input="onInput"
    />
    <small v-if="error" class="field__error">{{ error }}</small>
  </label>
</template>
