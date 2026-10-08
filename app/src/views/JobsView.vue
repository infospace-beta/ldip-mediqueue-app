<template>
  <div class="page">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Jobs</h1>
        <p class="mt-1 text-sm muted">
          Public list &middot; job details are behind the guard
        </p>
      </div>
      <BaseButton
        v-if="!auth.isLoggedIn"
        variant="ghost"
        size="sm"
        @click="router.push({ name: ROUTE_NAMES.login })"
      >
        Sign in to read
      </BaseButton>
    </header>

    <div class="mt-8">
      <JobList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import JobList from "@/components/jobs/JobList.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

const router = useRouter();
const auth = useAuthStore();
</script>
