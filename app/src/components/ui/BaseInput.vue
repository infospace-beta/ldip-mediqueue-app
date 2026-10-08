<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :name="name || id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="hasError"
      :aria-describedby="hasError ? `${id}-error` : undefined"
      :class="[
        'w-full rounded-lg border p-2.5 text-sm transition-colors disabled:opacity-50',
        'bg-white dark:bg-gray-950',
        hasError
          ? 'border-red-500'
          : 'border-gray-300 hover:border-gray-400 dark:border-gray-700',
      ]"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      @blur="$emit('blur', $event)"
    />
    <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
      <span
        v-for="(fieldError, index) in errors"
        :key="fieldErrorKey(fieldError, index)"
      >
        {{ fieldErrorMessage(fieldError) }}
      </span>
    </p>
    <p v-else-if="hint" class="muted mt-1 text-sm">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  fieldErrorKey,
  fieldErrorMessage,
  type FieldError,
} from "@/utils/fieldErrors";

/**
 * Text input with label and validation messages.
 * `errors` takes Vuelidate's $errors array (or plain strings).
 */
const props = withDefaults(
  defineProps<{
    id: string;
    modelValue?: string | number;
    label?: string;
    type?: string;
    name?: string;
    placeholder?: string;
    hint?: string;
    disabled?: boolean;
    errors?: FieldError[];
  }>(),
  { modelValue: "", type: "text", errors: () => [] },
);

defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
}>();

const hasError = computed(() => props.errors.length > 0);
</script>
