<script setup lang="ts">
import { reports } from '../data/mockData'
</script>

<template>
  <div class="page-shell__content">
    <section class="report-grid">
      <article v-for="item in reports" :key="item.label" class="report-card panel">
        <p class="eyebrow">{{ item.label }}</p>
        <h3>{{ item.value }}</h3>
        <span>{{ item.detail }}</span>
      </article>
    </section>
  </div>
</template>
