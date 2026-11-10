<template>
  <div class="overflow-hidden bg-white text-[#102f3b]">
    <section class="bg-[#f2f8f7]">
      <div
        class="mx-auto grid max-w-8xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:py-20"
      >
        <div class="public-reveal max-w-2xl">
          <p
            class="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
          >
            <span class="h-px w-8 bg-[#087f6b]" aria-hidden="true"></span>
            The MediQueue platform
          </p>
          <h1
            class="mt-6 max-w-xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.045em] text-[#102f3b] sm:text-6xl lg:text-[4.25rem]"
          >
            Better care starts with
            <span class="text-[#087f6b]">clearer information.</span>
          </h1>
          <p
            class="mt-6 max-w-lg text-base leading-7 text-[#536c72] sm:text-lg sm:leading-8"
          >
            A considered digital experience for navigating visit information —
            designed around patients and the people who care for them.
          </p>
          <p class="mt-4 max-w-lg text-sm leading-6 text-[#536c72]">
            The interface is taking shape. Live hospital services and patient
            information are not connected yet.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#platform-foundation"
              class="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#087f6b] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
            >
              Explore the platform
              <ArrowDown :size="17" aria-hidden="true" />
            </a>
            <RouterLink
              :to="{ name: ROUTE_NAMES.contact }"
              class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102f3b] underline decoration-[#9dcfc1] underline-offset-4 transition-colors hover:text-[#087f6b] focus-visible:rounded-sm"
            >
              Contact
              <ArrowUpRight :size="16" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>

        <figure class="feature-hero-image relative m-0 min-w-0">
          <div
            class="relative h-[27rem] overflow-hidden rounded-[1.25rem] bg-[#dce9e7] sm:h-[34rem] lg:h-[39rem]"
          >
            <img
              src="@/assets/images/optimized/care-team.jpg"
              alt="A healthcare professional ready to support a patient"
              class="feature-hero-photo absolute inset-0 h-full w-full object-cover object-[center_16%]"
              width="1200"
              height="1659"
              fetchpriority="high"
            />
          </div>
          <figcaption
            class="mt-4 flex items-start gap-4 border-l-2 border-[#087f6b] pl-4 text-sm leading-6 text-[#536c72]"
          >
            <span class="font-semibold text-[#102f3b]">People first.</span>
            Designed to make the next step easier to understand.
          </figcaption>
        </figure>
      </div>
    </section>

    <section id="platform-foundation" class="scroll-mt-24 bg-white">
      <div
        class="mx-auto max-w-8xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div
          class="grid gap-6 border-b border-[#dce9e7] pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16"
        >
          <div class="max-w-2xl">
            <p
              class="text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
            >
              A thoughtful foundation
            </p>
            <h2
              class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              Built for the realities of a care visit.
            </h2>
          </div>
          <p class="max-w-xl leading-7 text-[#536c72]">
            The current application provides role-specific screens and
            navigation. Connected clinical and operational information depends
            on future provider services.
          </p>
        </div>

        <div class="grid gap-x-12 lg:grid-cols-[1.15fr_0.85fr]">
          <article class="feature-current py-8 sm:py-10">
            <div class="flex items-start gap-5">
              <span
                class="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e3f3ee] text-[#087f6b]"
                aria-hidden="true"
              >
                <PanelsTopLeft :size="21" />
              </span>
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-[0.14em] text-[#087f6b]"
                >
                  Available now · interface layer
                </p>
                <h3 class="mt-2 text-2xl font-semibold tracking-tight">
                  A clear place to begin.
                </h3>
                <p class="mt-3 max-w-xl leading-7 text-[#536c72]">
                  Patient-facing and care-team interface foundations are in
                  place, with navigation shaped around each role. Account
                  registration and connected records are not available yet.
                </p>
              </div>
            </div>
          </article>

          <div
            class="divide-y divide-[#dce9e7] border-t border-[#dce9e7] lg:border-l lg:border-t-0 lg:pl-10"
          >
            <article
              v-for="foundation in FOUNDATIONS"
              :key="foundation.title"
              class="flex gap-4 py-6 first:pt-6 last:pb-6"
            >
              <component
                :is="foundation.icon"
                :size="20"
                class="mt-1 shrink-0 text-[#087f6b]"
                aria-hidden="true"
              />
              <div>
                <h3 class="font-semibold text-[#102f3b]">
                  {{ foundation.title }}
                </h3>
                <p class="mt-1 text-sm leading-6 text-[#536c72]">
                  {{ foundation.description }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#102f3b] text-white">
      <div
        class="mx-auto grid max-w-8xl gap-10 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20 lg:px-12 lg:py-20"
      >
        <div class="max-w-xl">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#75d3bd]"
          >
            Designed for connection
          </p>
          <h2
            class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
          >
            Useful information, when providers are ready to share it.
          </h2>
          <p class="mt-5 leading-7 text-[#d0dfdf]">
            MediQueue is being prepared to bring visit details into a clearer
            experience. These capabilities depend on verified integrations and
            are not live today.
          </p>
        </div>

        <div class="divide-y divide-white/15 border-y border-white/15">
          <article
            v-for="capability in CAPABILITIES"
            :key="capability.title"
            class="grid gap-2 py-5 sm:grid-cols-[minmax(12rem,0.65fr)_1fr] sm:gap-8"
          >
            <div class="flex items-center gap-3">
              <component
                :is="capability.icon"
                :size="19"
                class="shrink-0 text-[#75d3bd]"
                aria-hidden="true"
              />
              <h3 class="font-semibold">{{ capability.title }}</h3>
            </div>
            <p class="text-sm leading-6 text-[#c5d5df]">
              {{ capability.description }}
            </p>
          </article>
        </div>
      </div>
      <div class="border-t border-white/10">
        <p
          class="mx-auto max-w-8xl px-5 py-5 text-xs leading-5 text-[#c5d5df] sm:px-8 lg:px-12"
          role="note"
        >
          No live queue counts, appointment availability, hospital records, or
          provider integrations are currently displayed by MediQueue.
        </p>
      </div>
    </section>

    <section class="bg-[#f2f8f7]">
      <div
        class="mx-auto flex max-w-8xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-16"
      >
        <div class="max-w-2xl">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
          >
            Built with care
          </p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Clear about what works — and what comes next.
          </h2>
        </div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.howItWorks }"
          class="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-[#087f6b] underline decoration-[#9dcfc1] underline-offset-4 transition-colors hover:text-[#066c5c] focus-visible:rounded-sm"
        >
          See how MediQueue works
          <ArrowRight :size="17" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Clock3,
  PanelsTopLeft,
  ShieldCheck,
} from "@lucide/vue";
import { RouterLink } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";

const FOUNDATIONS = [
  {
    title: "Role-specific workspaces",
    description:
      "Separate interface foundations for patients, staff, and administrators.",
    icon: PanelsTopLeft,
  },
  {
    title: "Responsive by design",
    description:
      "Layouts and navigation adapt to phones, tablets, and larger screens.",
    icon: ShieldCheck,
  },
] as const;

const CAPABILITIES = [
  {
    title: "Queue information",
    description:
      "A clear view of visit flow, once connected providers can share verified information.",
    icon: Clock3,
  },
  {
    title: "Appointment details",
    description:
      "A place for appointment information when provider services are integrated.",
    icon: CalendarDays,
  },
  {
    title: "Hospital workspaces",
    description:
      "Hospital-specific access and staff permissions require backend membership and authorization.",
    icon: Building2,
  },
] as const;
</script>

<style scoped>
.feature-hero-photo {
  animation: feature-photo-enter 650ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  transition: transform 500ms ease;
}

.feature-hero-image:hover .feature-hero-photo {
  transform: scale(1.015);
}

.feature-current {
  border-bottom: 1px solid #dce9e7;
}

@keyframes feature-photo-enter {
  from {
    opacity: 0.7;
    transform: scale(1.025);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (min-width: 1024px) {
  .feature-current {
    border-bottom: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-hero-photo {
    animation: none;
    transition: none;
  }

  .feature-hero-image:hover .feature-hero-photo {
    transform: none;
  }
}
</style>
