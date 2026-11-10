<template>
  <footer class="border-t border-[#dce9e7] bg-[#f2f8f7]">
    <div
      class="mx-auto max-w-8xl px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16"
    >
      <div
        class="grid min-w-0 grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(11rem,0.8fr)_minmax(13rem,0.95fr)] lg:gap-x-16 lg:gap-y-0"
      >
        <section class="min-w-0 md:col-span-2 lg:col-span-1">
          <RouterLink
            :to="{ name: ROUTE_NAMES.landing }"
            class="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f6b]"
            aria-label="MediQueue home"
          >
            <AppLogo size="lg" />
          </RouterLink>
          <p class="mt-5 max-w-lg text-base leading-7 text-[#536c72]">
            A healthcare queue and visit-management platform in development,
            designed to help patients prepare queue requests and care teams
            organize visit information. Live hospital services are not connected
            yet.
          </p>
        </section>

        <nav
          aria-label="Explore MediQueue"
          class="flex min-w-0 flex-col items-stretch gap-1"
        >
          <h2
            class="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#102f3b]"
          >
            Explore
          </h2>
          <RouterLink
            :to="{ name: ROUTE_NAMES.landing }"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Home
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.howItWorks }"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            How It Works
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.features }"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Features
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.about }"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            About
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.faq }"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            FAQs
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.contact }"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Contact
          </RouterLink>
        </nav>

        <nav
          aria-label="Patient services"
          class="flex min-w-0 flex-col items-stretch gap-1"
        >
          <h2
            class="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#102f3b]"
          >
            Patient services
          </h2>
          <RouterLink
            to="/patient/dashboard"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Patient portal
          </RouterLink>
          <RouterLink
            to="/patient/join-queue"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Prepare a queue request
          </RouterLink>
          <RouterLink
            to="/patient/appointments"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Appointments
          </RouterLink>
          <RouterLink
            to="/patient/emergency"
            class="flex min-h-11 w-full items-center rounded-sm py-2 text-base leading-6 text-[#536c72] transition-colors hover:text-[#087f6b] hover:underline hover:decoration-[#9dcfc1] hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Emergency information
          </RouterLink>
        </nav>
      </div>

      <div
        class="mt-10 flex flex-col gap-3 border-t border-[#dce9e7] pt-5 text-sm leading-6 text-[#536c72] sm:flex-row sm:items-center sm:justify-between sm:gap-6"
      >
        <span>© {{ currentYear }} MediQueue</span>
        <p class="max-w-2xl sm:text-right">
          MediQueue does not replace emergency services or clinical advice.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppLogo from "@/components/common/AppLogo.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const currentYear = new Date().getFullYear();
</script>
