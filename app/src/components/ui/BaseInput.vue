<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="showPasswordToggle && passwordVisible ? 'text' : type"
        :name="name || id"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? `${id}-error` : undefined"
        :class="[
          'w-full rounded-lg border p-2.5 text-sm transition-colors disabled:opacity-50',
          'bg-white dark:bg-gray-950',
          showPasswordToggle ? 'pr-16' : '',
          hasError
            ? 'border-red-500'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-700',
        ]"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @blur="$emit('blur', $event)"
      />
      <button
        v-if="showPasswordToggle"
        type="button"
        :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
        :aria-pressed="passwordVisible"
        :aria-controls="id"
        class="absolute inset-y-0 right-3 my-auto h-fit rounded text-sm font-medium text-brand-700 hover:text-brand-900"
        @click="passwordVisible = !passwordVisible"
      >
        {{ passwordVisible ? "Hide" : "Show" }}
      </button>
    </div>
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
import { computed, ref } from "vue";
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
    autocomplete?: string;
    hint?: string;
    disabled?: boolean;
    showPasswordToggle?: boolean;
    errors?: FieldError[];
  }>(),
  {
    modelValue: "",
    type: "text",
    showPasswordToggle: false,
    errors: () => [],
  },
);

defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
}>();

const hasError = computed(() => props.errors.length > 0);
const passwordVisible = ref(false);
</script>
