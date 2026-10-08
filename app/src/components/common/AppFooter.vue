<template>
  <footer
    class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
  >
    <div
      class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-6"
    >
      <div class="muted flex items-center gap-2">
        <AppLogo size="sm" :with-wordmark="false" />
        <span>&copy; {{ currentYear }} Developers Mania</span>
      </div>

      <nav aria-label="Footer" class="muted flex gap-4">
        <RouterLink
          :to="{ name: ROUTE_NAMES.about }"
          class="hover:text-gray-900 hover:underline dark:hover:text-white"
        >
          About
        </RouterLink>
        <RouterLink
          :to="{ name: ROUTE_NAMES.contact }"
          class="hover:text-gray-900 hover:underline dark:hover:text-white"
        >
          Contact
        </RouterLink>
        <RouterLink
          :to="{ name: ROUTE_NAMES.faq }"
          class="hover:text-gray-900 hover:underline dark:hover:text-white"
        >
          FAQ
        </RouterLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppLogo from "@/components/common/AppLogo.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const currentYear = new Date().getFullYear();
</script>
