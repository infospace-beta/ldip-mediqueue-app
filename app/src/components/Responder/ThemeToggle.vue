 <script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
defineProps({ dark: Boolean })
defineEmits(['toggle'])
</script>

<template>
  <button class="responder-icon-button responder-theme-toggle" type="button" :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'" :title="dark ? 'Switch to light mode' : 'Switch to dark mode'" @click="$emit('toggle')">
    <Sun v-if="dark" :size="18" /><Moon v-else :size="18" />
  </button>
</template>
