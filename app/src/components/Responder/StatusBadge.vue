<script setup>
defineProps({ status: { type: String, required: true } })
</script>

<template><span class="responder-status-badge" :class="`status-${status.toLowerCase().replaceAll(' ', '-')}`"><i></i>{{ status }}</span></template>