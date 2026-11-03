<template>
  <div class="overflow-hidden bg-white text-[#102f3b]">
    <section class="bg-[#f2f8f7]">
      <div
        class="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:py-20"
      >
        <div class="public-reveal max-w-2xl">
          <p
            class="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
          >
            <span class="h-px w-8 bg-[#087f6b]" aria-hidden="true"></span>
            Smart queues. Clearer care.
          </p>
          <h1
            class="mt-6 max-w-xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[4.25rem]"
          >
            A clearer path to
            <span class="text-[#087f6b]">care.</span>
          </h1>
          <p
            class="mt-6 max-w-lg text-base leading-7 text-[#536c72] sm:text-lg sm:leading-8"
          >
            MediQueue is being developed to make queue and appointment
            information easier to navigate — with a clearer place to begin for
            patients and care teams.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <RouterLink
              :to="{ name: ROUTE_NAMES.signup }"
              class="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#087f6b] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
            >
              Get started
              <ArrowRight :size="17" aria-hidden="true" />
            </RouterLink>
            <RouterLink
              :to="{ name: ROUTE_NAMES.login }"
              class="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#b8d2cc] px-5 py-3 text-sm font-semibold text-[#102f3b] transition-colors hover:border-[#087f6b] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
            >
              Login
            </RouterLink>
          </div>
          <p class="mt-5 max-w-lg text-sm leading-6 text-[#536c72]">
            Online account creation and live hospital information are not
            connected yet.
          </p>
        </div>

        <figure class="landing-hero-image relative m-0 min-w-0">
          <div
            class="relative h-[24rem] overflow-hidden rounded-[1.25rem] bg-[#dce9e7] sm:h-[30rem] lg:h-[37rem]"
          >
            <img
              src="@/assets/images/optimized/home-care.jpg"
              alt="A healthcare professional speaking with a patient during a consultation"
              class="landing-hero-photo absolute inset-0 h-full w-full object-cover object-[center_42%]"
              width="1600"
              height="1067"
              fetchpriority="high"
            />
          </div>
          <figcaption
            class="mt-4 flex items-start gap-4 border-l-2 border-[#087f6b] pl-4 text-sm leading-6 text-[#536c72]"
          >
            <span class="font-semibold text-[#102f3b]">People first.</span>
            A more understandable journey through visit information.
          </figcaption>
        </figure>
      </div>
    </section>

    <section id="how-it-works" class="scroll-mt-24 bg-white">
      <div
        class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div
          class="grid gap-6 border-b border-[#dce9e7] pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16"
        >
          <div class="max-w-2xl">
            <p
              class="text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
            >
              How it works
            </p>
            <h2
              class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              A visit, with the next step in view.
            </h2>
          </div>
          <div>
            <p class="max-w-xl leading-7 text-[#536c72]">
              The intended experience begins with information shared by a care
              provider. Provider connections and live visit details are not
              available yet.
            </p>
            <RouterLink
              :to="{ name: ROUTE_NAMES.howItWorks }"
              class="mt-4 inline-flex min-h-10 items-center gap-2 font-semibold text-[#087f6b] underline decoration-[#9dcfc1] underline-offset-4 transition-colors hover:text-[#066c5c] focus-visible:rounded-sm"
            >
              See the patient journey
              <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>

        <ol
          class="grid gap-7 pt-8 sm:grid-cols-3 sm:gap-8 sm:pt-10"
          aria-label="The intended patient journey"
        >
          <li
            v-for="step in JOURNEY"
            :key="step.number"
            class="relative border-t border-[#b8d2cc] pt-5"
          >
            <span class="text-xs font-bold tracking-[0.14em] text-[#087f6b]">
              {{ step.number }}
            </span>
            <h3 class="mt-3 text-lg font-semibold">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-[#536c72]">
              {{ step.description }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section id="services" class="scroll-mt-24 bg-[#f2f8f7]">
      <div
        class="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-12 lg:py-24"
      >
        <div class="relative min-w-0">
          <img
            src="@/assets/images/optimized/care-journey.jpg"
            alt="A care professional supporting a patient during a clinic visit"
            class="public-image aspect-[4/3] w-full rounded-[1.25rem] object-cover object-center"
            width="1400"
            height="933"
            loading="lazy"
          />
          <p class="mt-3 text-xs leading-5 text-[#536c72]">
            MediQueue does not currently display live provider information.
          </p>
        </div>

        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
          >
            Designed around the visit
          </p>
          <h2
            class="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
          >
            Useful foundations. Honest boundaries.
          </h2>
          <p class="mt-5 max-w-xl leading-7 text-[#536c72]">
            Patient access and care-team workspace interfaces are taking shape.
            Queue and appointment details depend on connected provider services.
          </p>

          <div class="mt-7 divide-y divide-[#cdded9] border-y border-[#cdded9]">
            <article
              v-for="feature in FEATURE_PREVIEW"
              :key="feature.title"
              class="grid gap-2 py-4 sm:grid-cols-[0.7fr_1fr] sm:gap-6"
            >
              <h3 class="font-semibold">{{ feature.title }}</h3>
              <p class="text-sm leading-6 text-[#536c72]">
                {{ feature.description }}
              </p>
            </article>
          </div>
          <RouterLink
            :to="{ name: ROUTE_NAMES.features }"
            class="mt-6 inline-flex min-h-10 items-center gap-2 font-semibold text-[#087f6b] underline decoration-[#9dcfc1] underline-offset-4 transition-colors hover:text-[#066c5c] focus-visible:rounded-sm"
          >
            Explore the platform
            <ArrowRight :size="16" aria-hidden="true" />
          </RouterLink>
        </div>
      </div>
    </section>

    <section id="for-care-teams" class="scroll-mt-24 bg-white">
      <div
        class="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-12 lg:py-24"
      >
        <div class="max-w-2xl">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
          >
            Our purpose
          </p>
          <h2
            class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
          >
            Make care information easier to find and understand.
          </h2>
          <p class="mt-5 leading-7 text-[#536c72]">
            MediQueue is being developed as a clearer starting point for the
            queue and appointment information a provider chooses to make
            available.
          </p>
          <RouterLink
            :to="{ name: ROUTE_NAMES.about }"
            class="mt-5 inline-flex min-h-10 items-center gap-2 font-semibold text-[#087f6b] underline decoration-[#9dcfc1] underline-offset-4 transition-colors hover:text-[#066c5c] focus-visible:rounded-sm"
          >
            About MediQueue
            <ArrowRight :size="16" aria-hidden="true" />
          </RouterLink>
        </div>
        <aside class="border-l-2 border-[#087f6b] py-2 pl-6 sm:pl-8">
          <p
            class="text-xs font-bold uppercase tracking-[0.16em] text-[#087f6b]"
          >
            Human-centred by design
          </p>
          <p
            class="mt-3 max-w-xl text-xl font-medium leading-snug tracking-[-0.02em] text-[#102f3b] sm:text-2xl"
          >
            MediQueue is being developed to make visit information easier to
            find, while keeping care teams and patients at the centre.
          </p>
          <RouterLink
            :to="{ name: ROUTE_NAMES.about }"
            class="mt-5 inline-flex min-h-10 items-center gap-2 font-semibold text-[#087f6b] underline decoration-[#9dcfc1] underline-offset-4 transition-colors hover:text-[#066c5c] focus-visible:rounded-sm"
          >
            Our purpose
            <ArrowRight :size="16" aria-hidden="true" />
          </RouterLink>
        </aside>
      </div>
    </section>

    <section class="bg-[#f2f8f7]">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12"
      >
        <div class="max-w-3xl">
          <p class="font-semibold">Need urgent medical help?</p>
          <p class="mt-1 text-sm leading-6 text-[#536c72]">
            MediQueue does not dispatch emergency services. Contact your local
            emergency services directly.
          </p>
        </div>
        <RouterLink
          to="/patient/emergency"
          class="inline-flex min-h-10 shrink-0 items-center gap-2 font-semibold text-[#087f6b] underline decoration-[#9dcfc1] underline-offset-4 transition-colors hover:text-[#066c5c] focus-visible:rounded-sm"
        >
          Emergency information
          <ArrowRight :size="16" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>

    <section class="bg-[#102f3b] text-white">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-16"
      >
        <div class="max-w-2xl">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#75d3bd]"
          >
            Explore MediQueue
          </p>
          <h2
            class="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl"
          >
            Start with the information you need.
          </h2>
          <p class="mt-3 leading-7 text-[#d0dfdf]">
            Account registration and provider-connected information are not
            available yet.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            :to="{ name: ROUTE_NAMES.signup }"
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#39b99e] px-5 py-3 text-sm font-semibold text-[#082f2a] transition-colors hover:bg-[#58c9af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get started
            <ArrowRight :size="17" aria-hidden="true" />
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.login }"
            class="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Login
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import { RouterLink } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";

const JOURNEY = [
  {
    number: "01",
    title: "Check what is available",
    description:
      "Ask your care provider whether visit information is shared through MediQueue.",
  },
  {
    number: "02",
    title: "Access your patient account",
    description:
      "Online registration is not connected yet. Account access depends on a working service.",
  },
  {
    number: "03",
    title: "Review shared details",
    description:
      "When available, use provider-shared information to understand the next step in your visit.",
  },
] as const;

const FEATURE_PREVIEW = [
  {
    title: "Patient access",
    description:
      "Patient-facing interface foundations are present; online registration is not connected.",
  },
  {
    title: "Queue and appointments",
    description:
      "Designed for provider-shared visit information. Live data is not connected.",
  },
] as const;
</script>

<style scoped>
.landing-hero-photo {
  animation: landing-photo-enter 650ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  transition: transform 500ms ease;
}

.landing-hero-image:hover .landing-hero-photo {
  transform: scale(1.015);
}

@keyframes landing-photo-enter {
  from {
    opacity: 0.7;
    transform: scale(1.025);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing-hero-photo {
    animation: none;
    transition: none;
  }

  .landing-hero-image:hover .landing-hero-photo {
    transform: none;
  }
}
</style>
