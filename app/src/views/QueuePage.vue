<script setup>
import { ref } from "vue";
import { RefreshCw } from "@lucide/vue";
import QueueCard from "../components/QueueCard.vue";

const queueCard = ref(null);
</script>

<template>
  <div class="section-page queue-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">QUEUE DETAILS</span>
        <h1>My queue</h1>
        <p>View and update your ticket using the live hospital queue service.</p>
      </div>
      <button
        class="button button-secondary"
        type="button"
        @click="queueCard?.refreshStatus()"
      >
        <RefreshCw :size="16" aria-hidden="true" />
        Refresh status
      </button>
    </div>

    <QueueCard ref="queueCard" />
  </div>
</template>
