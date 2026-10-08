<template>
  <article class="page-narrow">
    <RouterLink
      :to="{ name: ROUTE_NAMES.jobs }"
      class="text-sm muted hover:underline"
    >
      &larr; All jobs
    </RouterLink>

    <StateLoading v-if="isLoading" class="mt-6" />
    <StateError
      v-else-if="error"
      class="mt-6"
      :message="error"
      :on-retry="load"
    />

    <BaseCard v-else-if="job" class="mt-6">
      <template #header>
        <div class="flex items-start justify-between gap-3">
          <h1 class="text-xl font-semibold">{{ job.title }}</h1>
          <BaseBadge tone="brand">Open</BaseBadge>
        </div>
      </template>

      <p class="leading-relaxed text-gray-700 dark:text-gray-300">
        {{ job.details }}
      </p>

      <template #footer>
        <p class="text-sm muted">Reference #{{ id }}</p>
      </template>
    </BaseCard>
  </article>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import StateLoading from "@/components/ui/StateLoading.vue";
import StateError from "@/components/ui/StateError.vue";
import { useJob } from "@/composables/useJobs";
import { ROUTE_NAMES } from "@/constants/routeNames";

const props = defineProps<{ id: string | number }>();

const { job, error, isLoading, load } = useJob(props.id);

onMounted(load);
</script>
