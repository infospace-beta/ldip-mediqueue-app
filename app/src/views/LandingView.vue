<template>
  <div class="overflow-hidden bg-white text-[#102f3b]">
    <section class="relative isolate bg-[#192d50]">
      <div
        class="absolute -right-48 -top-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#234165] blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-12 lg:py-24"
      >
        <div>
          <p class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#c5d5df]">
            <span class="h-2 w-2 rounded-full bg-[#22b8ad]" aria-hidden="true"></span>
            Smart queues. Clearer care.
          </p>
          <h1
            class="mt-6 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            A clearer path to care.
            <span class="text-[#22b8ad]">Queue information, in one place.</span>
          </h1>
          <p class="mt-6 max-w-xl text-base leading-8 text-[#d0dfdf] sm:text-lg">
            MediQueue brings the next steps in a hospital visit into focus.
            Find queue and appointment services, then keep your care details
            together in one place.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <RouterLink
              to="/patient/join-queue"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#087f6b] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
              <ArrowRight :size="18" aria-hidden="true" />
            </RouterLink>
            <RouterLink
              :to="{ name: ROUTE_NAMES.login }"
              class="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-transparent px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Login
            </RouterLink>
          </div>
          <p class="mt-5 max-w-lg text-sm leading-6 text-[#c5d5df]">
            Queue and appointment services depend on information made available
            by your care provider.
          </p>
        </div>

        <div class="relative mx-auto w-full max-w-xl">
          <div
            class="absolute -inset-5 rounded-[2.5rem] bg-[#22b8ad]/20 blur-2xl"
            aria-hidden="true"
          ></div>
          <div
            class="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#22385d] p-5 shadow-[0_24px_70px_-36px_rgba(0,0,0,0.7)] sm:p-7"
            role="img"
            aria-label="Illustration of a patient speaking with a healthcare professional above a non-live preview of queue and appointment information"
          >
            <svg
              class="w-full rounded-xl bg-[#e8f4f1]"
              viewBox="0 0 640 330"
              fill="none"
              aria-hidden="true"
            >
              <path d="M0 0h640v330H0z" fill="#E8F4F1" />
              <circle cx="554" cy="65" r="74" fill="#D5EBE4" />
              <circle cx="82" cy="276" r="92" fill="#D9ECE6" />
              <path d="M71 251h498" stroke="#A9C9BF" stroke-width="3" />
              <rect
                x="385"
                y="38"
                width="174"
                height="144"
                rx="15"
                fill="#F8FCFA"
                stroke="#C5DED5"
                stroke-width="3"
              />
              <path d="M472 40v140M389 110h166" stroke="#C5DED5" stroke-width="3" />
              <path d="M403 62h53M403 76h39M490 62h49M490 76h32" stroke="#D6E8E2" stroke-width="5" stroke-linecap="round" />
              <rect x="475" y="132" width="66" height="32" rx="8" fill="#DDF0E9" />
              <path d="M495 148h27m-13-13v26" stroke="#087F6B" stroke-width="5" stroke-linecap="round" />
              <path d="M97 231h147v14H97z" fill="#C29A78" />
              <path d="M107 245v42m127-42v42" stroke="#866952" stroke-width="8" stroke-linecap="round" />
              <path d="M116 218c6-31 30-47 55-47s48 16 55 47v13H116v-13Z" fill="#285568" />
              <path d="M146 200c7 12 24 18 40 14l16 18h-78l6-20 16-12Z" fill="#F8FCFA" />
              <circle cx="171" cy="125" r="42" fill="#D89C78" />
              <path d="M130 124c-5-34 12-58 43-58 27 0 43 19 40 52-12-7-19-18-22-29-12 16-31 26-61 28Z" fill="#243F4A" />
              <path d="M153 134c5 4 11 4 16 0m10 0c5 4 11 4 16 0" stroke="#664637" stroke-width="3" stroke-linecap="round" />
              <path d="M158 150c8 6 18 6 26 0" stroke="#9B5E4A" stroke-width="3" stroke-linecap="round" />
              <path d="M237 223c10-26 35-42 61-42h51c30 0 52 17 61 47l8 24H230l7-29Z" fill="#087F6B" />
              <path d="m290 183 21 26 21-26 15 69h-72l15-69Z" fill="#F8FCFA" />
              <circle cx="311" cy="118" r="43" fill="#B97858" />
              <path d="M270 118c-2-33 14-57 43-58 32-1 48 20 42 56-9-5-17-16-21-30-14 17-36 28-64 32Z" fill="#263D45" />
              <path d="M292 128c5 4 11 4 16 0m10 0c5 4 11 4 16 0" stroke="#593B31" stroke-width="3" stroke-linecap="round" />
              <path d="M299 146c8 6 18 6 26 0" stroke="#874F41" stroke-width="3" stroke-linecap="round" />
              <path d="M325 198c15 6 21 17 17 30" stroke="#087F6B" stroke-width="4" stroke-linecap="round" />
              <circle cx="342" cy="231" r="5" fill="#D5EBE4" stroke="#087F6B" stroke-width="3" />
              <rect x="374" y="214" width="60" height="38" rx="8" fill="#F8FCFA" stroke="#C5DED5" stroke-width="2" />
              <path d="M387 226h32m-32 9h23" stroke="#9DBFB5" stroke-width="3" stroke-linecap="round" />
              <path d="M515 236c4-19 18-29 34-29s29 10 33 29" stroke="#78A99A" stroke-width="7" stroke-linecap="round" />
              <path d="M534 206v-19m15 19v-27m15 27v-14" stroke="#78A99A" stroke-width="6" stroke-linecap="round" />
              <path d="M45 98h26m-13-13v26" stroke="#78A99A" stroke-width="5" stroke-linecap="round" />
            </svg>

            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span
                  class="grid h-11 w-11 place-items-center rounded-xl bg-[#e3f3ee] text-[#087f6b]"
                  aria-hidden="true"
                >
                  <HeartPulse :size="23" />
                </span>
                <div>
                  <p class="text-sm font-semibold text-white">
                    Your care overview
                  </p>
                  <p class="mt-1 text-xs text-[#c5d5df]">
                    A simple place to start
                  </p>
                </div>
              </div>
              <span
                class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-[#d0dfdf]"
              >
                Preview
              </span>
            </div>

            <div class="mt-7 rounded-2xl border border-[#dce9e7] bg-[#fbfdfc] p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#71878b]">
                    Queue information
                  </p>
                  <p class="mt-2 text-lg font-semibold text-[#102f3b]">
                    Your visit, at a glance
                  </p>
                </div>
                <span
                  class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e3f3ee] text-[#087f6b]"
                  aria-hidden="true"
                >
                  <Clock3 :size="20" />
                </span>
              </div>
              <div class="mt-5 flex items-center gap-3">
                <span class="h-2.5 w-2.5 rounded-full bg-[#087f6b]"></span>
                <span class="h-1.5 flex-1 rounded-full bg-[#dce9e7]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-[#dce9e7]"></span>
                <span class="h-1.5 flex-1 rounded-full bg-[#e8efed]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-[#e8efed]"></span>
              </div>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div class="rounded-xl bg-white p-4 ring-1 ring-[#e5eeeb]">
                  <div class="flex items-center gap-2 text-[#087f6b]">
                    <UsersRound :size="17" aria-hidden="true" />
                    <span class="text-xs font-semibold text-[#536c72]">
                      Queue services
                    </span>
                  </div>
                  <p class="mt-3 text-sm font-medium text-[#102f3b]">
                    Check the next step
                  </p>
                </div>
                <div class="rounded-xl bg-white p-4 ring-1 ring-[#e5eeeb]">
                  <div class="flex items-center gap-2 text-[#087f6b]">
                    <CalendarDays :size="17" aria-hidden="true" />
                    <span class="text-xs font-semibold text-[#536c72]">
                      Appointments
                    </span>
                  </div>
                  <p class="mt-3 text-sm font-medium text-[#102f3b]">
                    Keep visit details close
                  </p>
                </div>
              </div>
            </div>
            <p class="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#c5d5df]">
              <Info :size="15" aria-hidden="true" />
              An interface preview, not live queue data.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="scroll-mt-24 bg-white">
      <div class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div class="max-w-2xl">
          <p class="text-sm font-bold uppercase tracking-[0.16em] text-[#087f6b]">
            How it works
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-[#102f3b] sm:text-4xl">
            A more straightforward visit, step by step.
          </h2>
          <p class="mt-4 leading-7 text-[#536c72]">
            Start with the service you need. The available options depend on
            what your care provider offers through MediQueue.
          </p>
        </div>

        <ol class="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          <li class="border-t-2 border-[#b9dcd2] pt-5">
            <span class="text-sm font-bold text-[#087f6b]">01</span>
            <h3 class="mt-3 text-xl font-semibold text-[#102f3b]">
              Find your service
            </h3>
            <p class="mt-2 leading-7 text-[#536c72]">
              Choose the queue or appointment information relevant to your
              visit.
            </p>
          </li>
          <li class="border-t-2 border-[#b9dcd2] pt-5">
            <span class="text-sm font-bold text-[#087f6b]">02</span>
            <h3 class="mt-3 text-xl font-semibold text-[#102f3b]">
              Take the next step
            </h3>
            <p class="mt-2 leading-7 text-[#536c72]">
              Review the options provided by your care team and follow their
              instructions.
            </p>
          </li>
          <li class="border-t-2 border-[#b9dcd2] pt-5">
            <span class="text-sm font-bold text-[#087f6b]">03</span>
            <h3 class="mt-3 text-xl font-semibold text-[#102f3b]">
              Keep details in view
            </h3>
            <p class="mt-2 leading-7 text-[#536c72]">
              Return to your patient portal for the information available for
              your visit.
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section id="services" class="scroll-mt-24 bg-[#f2f8f7]">
      <div class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-sm font-bold uppercase tracking-[0.16em] text-[#087f6b]">
            Built around the visit
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-[#102f3b] sm:text-4xl">
            The essentials, in one place.
          </h2>
        </div>

        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <article class="rounded-2xl border border-[#dce9e7] bg-white p-6 sm:p-7">
            <span
              class="grid h-12 w-12 place-items-center rounded-xl bg-[#e3f3ee] text-[#087f6b]"
              aria-hidden="true"
            >
              <Clock3 :size="22" />
            </span>
            <h3 class="mt-5 text-lg font-semibold text-[#102f3b]">
              Queue information
            </h3>
            <p class="mt-2 leading-7 text-[#536c72]">
              Find queue services and visit details made available by your care
              provider.
            </p>
            <RouterLink
              to="/patient/join-queue"
              class="mt-5 inline-flex min-h-10 items-center gap-2 font-semibold text-[#087f6b] hover:underline focus-visible:rounded-sm"
            >
              Explore queue services
              <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </article>
          <article class="rounded-2xl border border-[#dce9e7] bg-white p-6 sm:p-7">
            <span
              class="grid h-12 w-12 place-items-center rounded-xl bg-[#e3f3ee] text-[#087f6b]"
              aria-hidden="true"
            >
              <CalendarDays :size="22" />
            </span>
            <h3 class="mt-5 text-lg font-semibold text-[#102f3b]">
              Appointment details
            </h3>
            <p class="mt-2 leading-7 text-[#536c72]">
              Keep the appointment information available to you easy to find.
            </p>
            <RouterLink
              to="/patient/appointments"
              class="mt-5 inline-flex min-h-10 items-center gap-2 font-semibold text-[#087f6b] hover:underline focus-visible:rounded-sm"
            >
              View appointments
              <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </article>
          <article class="rounded-2xl border border-[#dce9e7] bg-white p-6 sm:p-7">
            <span
              class="grid h-12 w-12 place-items-center rounded-xl bg-[#e3f3ee] text-[#087f6b]"
              aria-hidden="true"
            >
              <UserRound :size="22" />
            </span>
            <h3 class="mt-5 text-lg font-semibold text-[#102f3b]">
              Patient portal
            </h3>
            <p class="mt-2 leading-7 text-[#536c72]">
              Open the patient experience to see the services and information
              currently available.
            </p>
            <RouterLink
              to="/patient/dashboard"
              class="mt-5 inline-flex min-h-10 items-center gap-2 font-semibold text-[#087f6b] hover:underline focus-visible:rounded-sm"
            >
              Explore the portal
              <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </article>
        </div>
      </div>
    </section>

    <section id="for-care-teams" class="scroll-mt-24 bg-white">
      <div
        class="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-12"
      >
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.16em] text-[#087f6b]">
            For patients and care teams
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-[#102f3b] sm:text-4xl">
            Clearer information supports better conversations.
          </h2>
        </div>
        <div class="grid gap-8 sm:grid-cols-2">
          <div class="border-l-2 border-[#b9dcd2] pl-5">
            <h3 class="text-lg font-semibold text-[#102f3b]">For patients</h3>
            <p class="mt-2 leading-7 text-[#536c72]">
              A straightforward starting point for queue and appointment
              information, with the next steps guided by your care provider.
            </p>
          </div>
          <div class="border-l-2 border-[#b9dcd2] pl-5">
            <h3 class="text-lg font-semibold text-[#102f3b]">For care teams</h3>
            <p class="mt-2 leading-7 text-[#536c72]">
              A patient-facing place to make visit information easier to find
              when services are available through the platform.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#fff8f5]">
      <div class="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div
          class="flex flex-col gap-5 rounded-2xl border border-[#f1ded6] bg-white p-6 sm:flex-row sm:items-start sm:p-8"
        >
          <span
            class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#fff0e9] text-[#9a412f]"
            aria-hidden="true"
          >
            <ShieldAlert :size="23" />
          </span>
          <div>
            <h2 class="text-xl font-semibold text-[#652f27]">
              Need emergency help?
            </h2>
            <p class="mt-2 max-w-3xl leading-7 text-[#624c49]">
              MediQueue does not dispatch emergency services. If you or someone
              else may be in immediate danger, contact your local emergency
              services directly.
            </p>
            <RouterLink
              to="/patient/emergency"
              class="mt-4 inline-flex min-h-10 items-center gap-2 font-semibold text-[#8a392d] underline decoration-[#d6a49a] underline-offset-4 hover:text-[#652f27] focus-visible:rounded-sm"
            >
              Read emergency information
              <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#102f3b]">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12"
      >
        <div class="max-w-2xl">
          <h2 class="text-2xl font-bold text-white sm:text-3xl">
            Take the next step with MediQueue.
          </h2>
          <p class="mt-3 leading-7 text-[#d0dfdf]">
            Explore the patient portal or sign in to continue to your account.
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <RouterLink
            to="/patient/dashboard"
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#39b99e] px-6 py-3 font-semibold text-[#082f2a] transition hover:bg-[#58c9af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Patient portal
            <ArrowRight :size="17" aria-hidden="true" />
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.login }"
            class="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Sign in
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  HeartPulse,
  Info,
  ShieldAlert,
  UserRound,
  UsersRound,
} from "@lucide/vue";
import { RouterLink } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";
</script>
