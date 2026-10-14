
<template>
  <footer class="border-t border-[#dce9e7] bg-[#f0f8f6]">
    <div
      class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-8 lg:px-12"
    >
      <RouterLink
        :to="{ name: ROUTE_NAMES.landing }"
        class="flex items-center gap-2 rounded-lg"
        aria-label="MediQueue home"
      >
        <AppLogo size="sm" :with-wordmark="false" />
        <span class="text-sm font-semibold text-[#102f3b]">
          © {{ currentYear }} MediQueue
        </span>
      </RouterLink>

      <nav
        aria-label="Footer navigation"
        class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#536c72]"
      >
        <RouterLink
          :to="{ name: ROUTE_NAMES.landing }"
          class="transition hover:text-[#008c76] hover:underline"
        >
          Home
        </RouterLink>

        <RouterLink
          to="/patient/appointments"
          class="transition hover:text-[#008c76] hover:underline"
        >
          Appointments
        </RouterLink>

        <RouterLink
          to="/patient/emergency"
          class="transition hover:text-[#008c76] hover:underline"
        >
          Emergency assistance
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
