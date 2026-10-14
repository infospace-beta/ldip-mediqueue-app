<script setup>
defineProps({ priority: { type: String, required: true } })
</script>

<template><span class="responder-priority-badge" :class="`priority-${priority.toLowerCase()}`">{{ priority }}</span></template>