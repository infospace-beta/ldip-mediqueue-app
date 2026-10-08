<template>
  <div>
    <StateLoading v-if="isLoading" label="Loading jobs..." />
    <StateError v-else-if="error" :message="error" :on-retry="load" />
    <StateEmpty
      v-else-if="!jobs.length"
      title="No jobs posted"
      description="Run `npm run mock` to serve data/db.json, then reload."
    />

    <ul v-else class="grid gap-4 sm:grid-cols-2">
      <li v-for="job in jobs" :key="job.id">
        <BaseCard
          :to="{ name: ROUTE_NAMES.jobDetails, params: { id: job.id } }"
        >
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-semibold">{{ job.title }}</h3>
            <BaseBadge tone="brand">Open</BaseBadge>
          </div>
          <p class="mt-2 text-sm muted">{{ job.details }}</p>
        </BaseCard>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import StateLoading from "@/components/ui/StateLoading.vue";
import StateEmpty from "@/components/ui/StateEmpty.vue";
import StateError from "@/components/ui/StateError.vue";
import { useJobs } from "@/composables/useJobs";
import { ROUTE_NAMES } from "@/constants/routeNames";

const { jobs, error, isLoading, load } = useJobs();

onMounted(load);
</script>
