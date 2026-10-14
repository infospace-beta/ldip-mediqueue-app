
<template>
  <div class="min-h-screen bg-white text-[#102f3b]">
    <!-- Hero section -->
    <section class="overflow-hidden bg-gradient-to-br from-[#f0f8f6] via-white to-[#e4f5f0]">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">
        <div>
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cce9e2] bg-white px-4 py-2 text-sm font-medium text-[#087f6b]">
            <span class="h-2 w-2 rounded-full bg-[#00a98f]"></span>
            Better access to healthcare
          </div>

          <h1 class="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your healthcare journey,
            <span class="text-[#009b83]">made simpler.</span>
          </h1>

          <p class="mt-6 max-w-xl text-base leading-8 text-[#536c72] sm:text-lg">
            Spend less time wondering where to go next. MediQueue helps you
            manage hospital queues, keep track of appointments and access
            emergency assistance when you need it.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <RouterLink
              to="/patient/join-queue"
              class="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#00a98f] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#008c76] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a98f]"
            >
              Join a queue
              <span class="ml-2" aria-hidden="true">→</span>
            </RouterLink>

            <RouterLink
              to="/patient/dashboard"
              class="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#cbdedb] bg-white px-6 py-3 font-semibold text-[#102f3b] transition hover:bg-[#f0f8f6]"
            >
              Patient portal
            </RouterLink>
          </div>

          <p class="mt-5 text-sm leading-6 text-[#71878b]">
            Designed to make hospital visits clearer and more organised.
          </p>
        </div>

        <!-- Hero image -->
        <div class="relative">
          <div class="absolute -inset-4 rounded-[2rem] bg-[#00a98f]/10 blur-2xl"></div>

          <div class="relative overflow-hidden rounded-3xl border border-[#dce9e7] bg-white p-3 shadow-xl sm:p-4">
            <img
              src="/mediqueue-hero.png"
              alt="MediQueue healthcare experience"
              class="aspect-[4/3] w-full rounded-2xl object-cover"
            />

            <div class="flex items-center gap-4 px-3 py-4 sm:px-5">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e4f5f0] text-2xl" aria-hidden="true">
                +
              </div>
              <div>
                <p class="font-semibold text-[#102f3b]">Care starts with clarity</p>
                <p class="mt-1 text-sm text-[#71878b]">
                  Queue information and patient services in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main services -->
    <section class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-[#009b83]">
          What you can do
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Healthcare services, made easier
        </h2>
        <p class="mt-4 leading-7 text-[#536c72]">
          Find the service you need and take the next step with confidence.
        </p>
      </div>

      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <article class="rounded-2xl border border-[#dce9e7] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e4f5f0] text-2xl text-[#008c76]" aria-hidden="true">
            ≡
          </div>
          <h3 class="mt-5 text-xl font-bold">Hospital queues</h3>
          <p class="mt-3 leading-7 text-[#536c72]">
            Access queue services and keep track of your place in the process.
          </p>
          <RouterLink
            to="/patient/queue"
            class="mt-5 inline-flex items-center font-semibold text-[#008c76] hover:underline"
          >
            View my queue <span class="ml-2" aria-hidden="true">→</span>
          </RouterLink>
        </article>

        <article class="rounded-2xl border border-[#dce9e7] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e4f5f0] text-2xl text-[#008c76]" aria-hidden="true">
            ▦
          </div>
          <h3 class="mt-5 text-xl font-bold">Appointments</h3>
          <p class="mt-3 leading-7 text-[#536c72]">
            Find your appointment information and keep your healthcare visits organised.
          </p>
          <RouterLink
            to="/patient/appointments"
            class="mt-5 inline-flex items-center font-semibold text-[#008c76] hover:underline"
          >
            View appointments <span class="ml-2" aria-hidden="true">→</span>
          </RouterLink>
        </article>

        <article class="rounded-2xl border border-[#f0d7d5] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0ef] text-2xl text-[#c43d36]" aria-hidden="true">
            !
          </div>
          <h3 class="mt-5 text-xl font-bold">Emergency assistance</h3>
          <p class="mt-3 leading-7 text-[#536c72]">
            Access the emergency assistance section when urgent help is needed.
          </p>
          <RouterLink
            to="/patient/emergency"
            class="mt-5 inline-flex items-center font-semibold text-[#c43d36] hover:underline"
          >
            Get assistance <span class="ml-2" aria-hidden="true">→</span>
          </RouterLink>
        </article>
      </div>
    </section>

    <!-- Closing call to action -->
    <section class="bg-[#102f3b]">
      <div class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div class="max-w-2xl">
          <h2 class="text-2xl font-bold text-white sm:text-3xl">
            Take the next step in your healthcare journey.
          </h2>
          <p class="mt-3 leading-7 text-[#c1d5d6]">
            Visit the patient portal to access MediQueue's available services.
          </p>
        </div>

        <RouterLink
          to="/patient/dashboard"
          class="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#00a98f] px-6 py-3 font-semibold text-white transition hover:bg-[#008c76]"
        >
          Open patient portal
          <span class="ml-2" aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
