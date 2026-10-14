<script setup lang="ts">
import QueueTable from '../components/QueueTable.vue'
import { patients } from '../data/mockData'
</script>

<template>
  <div class="page-shell__content">
    <section class="panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">Queue management</p>
          <h3>Patient queue</h3>
        </div>
        <div class="toolbar">
          <select class="select-lite" aria-label="Department filter">
            <option>Cardiology</option>
            <option>General Consultation</option>
            <option>Emergency</option>
          </select>
          <button type="button" class="ui-button ui-button--secondary ui-button--md">Call next patient</button>
        </div>
      </div>

      <div class="filter-row">
        <button type="button" class="chip chip--active">All Queues</button>
        <button type="button" class="chip">Waiting</button>
        <button type="button" class="chip">In Consultation</button>
        <button type="button" class="chip">Completed</button>
        <button type="button" class="chip">Priority</button>
        <button type="button" class="chip">Emergency</button>
      </div>

      <QueueTable :patients="patients" />
    </section>
  </div>
</template>
