<script setup>
import { RefreshCw } from '@lucide/vue'
import QueueCard from '../components/QueueCard.vue'
</script>

<template>
  <div class="section-page queue-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">QUEUE DETAILS</span>
        <h1>My queue</h1>
        <p>Live status and refresh are unavailable until a hospital service is connected.</p>
      </div>
      <button
        class="button button-secondary"
        type="button"
        disabled
        title="Live queue updates are unavailable in this prototype"
      >
        <RefreshCw :size="16" aria-hidden="true" />
        Refresh status
      </button>
    </div>

    <QueueCard />
  </div>
</template>
