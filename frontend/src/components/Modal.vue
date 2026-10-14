<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
  }>(),
  {
    modelValue: false,
    title: 'Modal',
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click="close">
    <div class="modal-card" role="dialog" aria-modal="true" @click.stop>
      <div class="modal-card__header">
        <h3>{{ title }}</h3>
        <button type="button" class="modal-close" aria-label="Close" @click="close">✕</button>
      </div>
      <div class="modal-card__body">
        <slot />
      </div>
    </div>
  </div>
</template>
