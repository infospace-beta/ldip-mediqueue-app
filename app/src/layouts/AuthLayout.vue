<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 py-12 dark:bg-gray-950"
  >
    <RouterLink :to="{ name: ROUTE_NAMES.landing }">
      <AppLogo size="lg" />
    </RouterLink>

    <slot />

    <RouterLink
      :to="{ name: ROUTE_NAMES.landing }"
      class="text-sm muted hover:underline"
    >
      Back to the site
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppLogo from "@/components/common/AppLogo.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";
</script>
