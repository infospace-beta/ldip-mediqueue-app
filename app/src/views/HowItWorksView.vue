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
            How MediQueue works
          </p>
          <h1
            class="mt-6 max-w-xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[4.25rem]"
          >
            Know where to
            <span class="text-[#087f6b]">begin.</span>
          </h1>
          <p
            class="mt-6 max-w-lg text-base leading-7 text-[#536c72] sm:text-lg sm:leading-8"
          >
            MediQueue is being developed to make queue and appointment
            information easier to navigate, when it is shared by your care
            provider.
          </p>
          <p class="mt-4 max-w-lg text-sm leading-6 text-[#536c72]">
            Provider services, account registration, and live visit details are
            not connected yet.
          </p>
          <RouterLink
            :to="{ name: ROUTE_NAMES.features }"
            class="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#087f6b] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Explore the platform
            <ArrowRight :size="17" aria-hidden="true" />
          </RouterLink>
        </div>
        <figure class="journey-hero-image relative m-0 min-w-0">
          <div
            class="relative h-[24rem] overflow-hidden rounded-[1.25rem] bg-[#dce9e7] sm:h-[30rem] lg:h-[37rem]"
          >
            <img
              src="@/assets/images/optimized/care-journey.jpg"
              alt="A care professional supporting a patient during a clinic visit"
              class="journey-hero-photo absolute inset-0 h-full w-full object-cover object-[center_42%]"
              width="1400"
              height="933"
              fetchpriority="high"
            />
          </div>
          <figcaption
            class="mt-4 border-l-2 border-[#087f6b] pl-4 text-sm leading-6 text-[#536c72]"
          >
            A planned journey built around clarity and care.
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="bg-white">
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
              The intended patient journey
            </p>
            <h2
              class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              Three steps. Information in context.
            </h2>
          </div>
          <p class="max-w-xl leading-7 text-[#536c72]">
            Your care provider determines what is available. These steps
            describe the intended experience, not a live connected service.
          </p>
        </div>

        <ol class="journey-steps mt-4">
          <li
            v-for="(step, index) in STEPS"
            :key="step.number"
            class="journey-step grid gap-5 border-b border-[#dce9e7] py-7 sm:grid-cols-[4rem_3rem_1fr] sm:items-start sm:gap-6 sm:py-8"
          >
            <span
              class="text-sm font-bold tracking-[0.12em] text-[#087f6b]"
              aria-hidden="true"
            >
              {{ step.number }}
            </span>
            <span
              class="grid h-11 w-11 place-items-center rounded-full bg-[#e3f3ee] text-[#087f6b]"
              aria-hidden="true"
            >
              <component :is="step.icon" :size="20" />
            </span>
            <div class="max-w-3xl">
              <h3 class="text-xl font-semibold tracking-tight sm:text-2xl">
                {{ step.title }}
              </h3>
              <p class="mt-2 leading-7 text-[#536c72]">
                {{ step.description }}
              </p>
              <p
                v-if="index === 1"
                class="mt-3 text-sm font-medium text-[#087f6b]"
              >
                Online account registration is not available yet.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="bg-[#102f3b] text-white">
      <div
        class="mx-auto grid max-w-8xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12 lg:py-16"
      >
        <div class="max-w-2xl">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#75d3bd]"
          >
            A clear boundary
          </p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            MediQueue does not replace your care provider.
          </h2>
          <p class="mt-3 leading-7 text-[#d0dfdf]">
            Follow instructions from your healthcare team. MediQueue does not
            provide clinical advice or dispatch emergency services.
          </p>
        </div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.faq }"
          class="inline-flex min-h-11 items-center gap-2 font-semibold text-white underline decoration-[#75d3bd] underline-offset-4 transition-colors hover:text-[#75d3bd] focus-visible:rounded-sm"
        >
          Read the FAQs
          <ArrowRight :size="16" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  UserRound,
} from "@lucide/vue";
import { RouterLink } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";

const STEPS = [
  {
    number: "01",
    title: "Check what your provider offers",
    description:
      "Ask your care provider whether visit, queue, or appointment information is shared through MediQueue.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Access your patient account",
    description:
      "When account registration and access are connected, your patient account will be the starting point for the available experience.",
    icon: UserRound,
  },
  {
    number: "03",
    title: "Review shared visit details",
    description:
      "When your provider makes information available, review it and follow the guidance from your care team.",
    icon: CalendarDays,
  },
] as const;
</script>

<style scoped>
.journey-step {
  animation: journey-step-enter 420ms ease both;
}

.journey-step:nth-child(2) {
  animation-delay: 80ms;
}

.journey-step:nth-child(3) {
  animation-delay: 160ms;
}

.journey-hero-photo {
  transition: transform 500ms ease;
}

.journey-hero-image:hover .journey-hero-photo {
  transform: scale(1.015);
}

@keyframes journey-step-enter {
  from {
    opacity: 0.75;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .journey-step {
    animation: none;
  }

  .journey-hero-photo {
    transition: none;
  }

  .journey-hero-image:hover .journey-hero-photo {
    transform: none;
  }
}
</style>
