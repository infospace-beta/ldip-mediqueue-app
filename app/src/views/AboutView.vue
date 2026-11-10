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
            About MediQueue
          </p>
          <h1
            class="mt-6 max-w-xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[4.25rem]"
          >
            Care information,
            <span class="text-[#087f6b]">made clearer.</span>
          </h1>
          <p
            class="mt-6 max-w-lg text-base leading-7 text-[#536c72] sm:text-lg sm:leading-8"
          >
            MediQueue is being developed to make queue and appointment
            information easier to find and navigate.
          </p>
          <p class="mt-4 max-w-lg text-sm leading-6 text-[#536c72]">
            Our focus is a clear, accessible starting point for the information
            a care provider chooses to make available.
          </p>
          <RouterLink
            :to="{ name: ROUTE_NAMES.howItWorks }"
            class="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#087f6b] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            How it works
            <ArrowRight :size="17" aria-hidden="true" />
          </RouterLink>
        </div>
        <figure class="about-hero-image relative m-0 min-w-0">
          <div
            class="relative h-[24rem] overflow-hidden rounded-[1.25rem] bg-[#dce9e7] sm:h-[30rem] lg:h-[37rem]"
          >
            <img
              src="@/assets/images/optimized/about-care.jpg"
              alt="A clinician and patient reviewing care information together"
              class="about-hero-photo absolute inset-0 h-full w-full object-cover object-[center_30%]"
              width="1400"
              height="2100"
              fetchpriority="high"
            />
          </div>
          <figcaption
            class="mt-4 border-l-2 border-[#087f6b] pl-4 text-sm leading-6 text-[#536c72]"
          >
            Technology should support the human side of every care visit.
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
              Why MediQueue
            </p>
            <h2
              class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              A clearer way to find the next step.
            </h2>
          </div>
          <p class="max-w-xl leading-7 text-[#536c72]">
            Visit information can be difficult to keep together. MediQueue aims
            to give patients and care teams a more understandable place to
            start.
          </p>
        </div>

        <div class="grid gap-x-16 lg:grid-cols-2">
          <article
            class="border-b border-[#dce9e7] py-8 sm:py-10 lg:border-b-0"
          >
            <p
              class="text-xs font-bold uppercase tracking-[0.16em] text-[#087f6b]"
            >
              Our purpose
            </p>
            <h3 class="mt-3 text-2xl font-semibold tracking-tight">
              Make visit information easier to navigate.
            </h3>
            <p class="mt-4 max-w-xl leading-7 text-[#536c72]">
              We are building a clear, accessible frontend for queue and
              appointment information that healthcare providers may choose to
              share.
            </p>
          </article>
          <article
            class="border-b border-[#dce9e7] py-8 sm:py-10 lg:border-b-0 lg:border-l lg:pl-12"
          >
            <p
              class="text-xs font-bold uppercase tracking-[0.16em] text-[#087f6b]"
            >
              Our approach
            </p>
            <h3 class="mt-3 text-2xl font-semibold tracking-tight">
              Be useful, and be clear about what is available.
            </h3>
            <p class="mt-4 max-w-xl leading-7 text-[#536c72]">
              Hospital services, operational records, and provider connections
              are not live yet. We do not present unavailable information as
              real.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-[#102f3b] text-white">
      <div
        class="mx-auto flex max-w-8xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-16"
      >
        <div class="max-w-2xl">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#75d3bd]"
          >
            Learn more
          </p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            See how the experience is being designed.
          </h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            :to="{ name: ROUTE_NAMES.features }"
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#39b99e] px-5 py-3 text-sm font-semibold text-[#082f2a] transition-colors hover:bg-[#58c9af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore features
            <ArrowRight :size="17" aria-hidden="true" />
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.contact }"
            class="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Contact
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
</script>

<style scoped>
.about-hero-photo {
  animation: about-photo-enter 650ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  transition: transform 500ms ease;
}

.about-hero-image:hover .about-hero-photo {
  transform: scale(1.015);
}

@keyframes about-photo-enter {
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
  .about-hero-photo {
    animation: none;
    transition: none;
  }

  .about-hero-image:hover .about-hero-photo {
    transform: none;
  }
}
</style>
