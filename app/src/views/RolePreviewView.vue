<template>
  <main class="page page-narrow">
    <p class="text-sm font-semibold uppercase text-brand-700">Local demo preview</p>
    <h1 class="mt-2 text-3xl font-semibold">{{ route.meta.title }}</h1>
    <section class="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-lg font-semibold">Hospital services are not connected</h2>
      <p class="mt-2 text-sm text-slate-600">
        This role-specific workspace is a frontend preview. It does not display
        live hospital data or perform operational actions.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>