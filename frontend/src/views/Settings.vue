<script setup lang="ts">
const preferences = [
  { label: 'Emergency notifications', value: true },
  { label: 'Department alerts', value: true },
  { label: 'Auto-refresh patient queue', value: false },
  { label: 'High-priority call sound', value: true },
]
</script>

<template>
  <div class="page-shell__content">
    <section class="panel settings-panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">System settings</p>
          <h3>Staff preferences</h3>
        </div>
      </div>

      <div class="settings-list">
        <div v-for="pref in preferences" :key="pref.label" class="setting-row">
          <span>{{ pref.label }}</span>
          <button type="button" class="toggle" :class="{ 'toggle--on': pref.value }">
            <span></span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
