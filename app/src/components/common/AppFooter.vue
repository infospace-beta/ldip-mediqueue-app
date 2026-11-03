<template>
  <footer class="border-t border-[#dce9e7] bg-[#f2f8f7]">
    <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div class="max-w-sm">
          <RouterLink
            :to="{ name: ROUTE_NAMES.landing }"
            class="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f6b]"
            aria-label="MediQueue home"
          >
            <AppLogo size="md" />
          </RouterLink>
          <p class="mt-4 text-sm leading-6 text-[#536c72]">
            MediQueue is being developed to help patients and care teams
            organize queue and visit information. Live hospital services are not
            connected yet.
          </p>
          <p class="mt-3 text-sm text-[#536c72]">
            Questions?
            <RouterLink
              :to="{ name: ROUTE_NAMES.contact }"
              class="font-semibold text-[#087f6b] underline decoration-[#9dcfc1] underline-offset-4 hover:text-[#066c5c]"
            >
              Contact us
            </RouterLink>
          </p>
        </div>

        <nav
          aria-label="Explore MediQueue"
          class="flex flex-col items-start gap-3"
        >
          <h2 class="text-sm font-semibold text-[#102f3b]">Explore</h2>
          <RouterLink
            :to="{ name: ROUTE_NAMES.howItWorks }"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            How it works
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.features }"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            Features
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.about }"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            About MediQueue
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.faq }"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            Frequently asked questions
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.contact }"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            Contact us
          </RouterLink>
        </nav>

        <nav
          aria-label="Patient services"
          class="flex flex-col items-start gap-3"
        >
          <h2 class="text-sm font-semibold text-[#102f3b]">Patient services</h2>
          <RouterLink
            to="/patient/dashboard"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            Patient portal
          </RouterLink>
          <RouterLink
            to="/patient/join-queue"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            Prepare a queue request
          </RouterLink>
          <RouterLink
            to="/patient/appointments"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            Appointments
          </RouterLink>
          <RouterLink
            to="/patient/emergency"
            class="text-sm text-[#536c72] hover:text-[#087f6b] hover:underline"
          >
            Emergency information
          </RouterLink>
        </nav>
      </div>

      <div
        class="mt-9 flex flex-col gap-2 border-t border-[#dce9e7] pt-5 text-xs text-[#61777b] sm:flex-row sm:items-center sm:justify-between"
      >
        <span>© {{ currentYear }} MediQueue</span>
        <span>
          MediQueue does not replace emergency services or clinical advice.
        </span>
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
