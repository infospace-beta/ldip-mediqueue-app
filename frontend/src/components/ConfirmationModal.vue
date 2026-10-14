<script setup>
defineProps({
  open: Boolean,
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: 'This action cannot be undone.' },
  confirmLabel: { type: String, default: 'Confirm' },
  destructive: Boolean,
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="$emit('cancel')" @keydown.esc="$emit('cancel')">
      <section class="confirm-modal" role="dialog" aria-modal="true" :aria-label="title">
        <div class="modal-icon" :class="{ 'modal-icon-danger': destructive }"><CircleAlert v-if="destructive" :size="22" /><Info v-else :size="22" /></div>
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="button button-secondary" type="button" @click="$emit('cancel')">Keep it</button>
          <button class="button" :class="destructive ? 'button-danger' : 'button-primary'" type="button" @click="$emit('confirm')">{{ confirmLabel }}</button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script>
import { CircleAlert, Info } from '@lucide/vue'
export default { components: { CircleAlert, Info } }
</script>