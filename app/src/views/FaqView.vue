<template>
  <div class="overflow-hidden bg-white text-[#102f3b]">
    <section class="bg-[#f2f8f7]">
      <div
        class="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16 lg:px-12 lg:py-20"
      >
        <div class="public-reveal max-w-3xl">
          <p
            class="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
          >
            <span class="h-px w-8 bg-[#087f6b]" aria-hidden="true"></span>
            FAQs
          </p>
          <h1
            class="mt-6 max-w-2xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl"
          >
            Clear answers,
            <span class="text-[#087f6b]">without the guesswork.</span>
          </h1>
          <p
            class="mt-6 max-w-2xl text-base leading-7 text-[#536c72] sm:text-lg sm:leading-8"
          >
            Find out what MediQueue can do today, what is still being developed,
            and where its current limits are.
          </p>
        </div>
        <aside class="border-l-2 border-[#087f6b] py-1 pl-5">
          <p
            class="text-xs font-bold uppercase tracking-[0.16em] text-[#087f6b]"
          >
            Current availability
          </p>
          <p class="mt-3 leading-7 text-[#536c72]">
            Provider services are not connected. MediQueue does not show live
            hospital records, queue details, or appointments.
          </p>
        </aside>
      </div>
    </section>

    <section>
      <div
        class="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16 lg:px-12 lg:py-20"
      >
        <div class="max-w-sm">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
          >
            Good to know
          </p>
          <h2 class="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            About using MediQueue
          </h2>
          <p class="mt-4 leading-7 text-[#536c72]">
            These answers reflect the current application. They may change as
            connected services become available.
          </p>
        </div>

        <dl class="divide-y divide-[#dce9e7] border-y border-[#dce9e7]">
          <div v-for="(item, index) in FAQS" :key="item.question" class="py-1">
            <dt>
              <button
                :id="`faq-question-${index}`"
                type="button"
                class="flex min-h-16 w-full items-center justify-between gap-5 py-5 text-left text-base font-semibold leading-6 transition-colors hover:text-[#087f6b] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b] sm:text-lg"
                :aria-expanded="openIndex === index"
                :aria-controls="`faq-answer-${index}`"
                @click="toggle(index)"
              >
                <span>{{ item.question }}</span>
                <ChevronDown
                  :size="20"
                  aria-hidden="true"
                  class="shrink-0 text-[#087f6b] transition-transform duration-200"
                  :class="{ 'rotate-180': openIndex === index }"
                />
              </button>
            </dt>
            <dd
              :id="`faq-answer-${index}`"
              :aria-labelledby="`faq-question-${index}`"
              :aria-hidden="openIndex !== index"
              class="faq-answer text-[#536c72]"
              :data-open="openIndex === index"
            >
              <div>
                <p class="max-w-3xl pb-6 pr-8 leading-7">{{ item.answer }}</p>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="bg-[#102f3b] text-white">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-16"
      >
        <div class="max-w-2xl">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-[#75d3bd]"
          >
            Still have a question?
          </p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Get in touch with MediQueue.
          </h2>
          <p class="mt-3 leading-7 text-[#d0dfdf]">
            The contact form is available for review, but message delivery is
            not connected yet.
          </p>
        </div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.contact }"
          class="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#39b99e] px-5 py-3 text-sm font-semibold text-[#082f2a] transition-colors hover:bg-[#58c9af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Contact us
          <ArrowRight :size="17" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ArrowRight, ChevronDown } from "@lucide/vue";
import { RouterLink } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";

const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const FAQS = [
  {
    question: "Can I see live queue or appointment information?",
    answer:
      "Not yet. Hospital and provider services are not connected, so MediQueue does not currently show live queues, appointments, or hospital records.",
  },
  {
    question: "Can I create a patient account online?",
    answer:
      "The signup interface is available, but online account registration is not connected. Submitting the form will not create an account.",
  },
  {
    question: "Does MediQueue work with my hospital?",
    answer:
      "Provider integrations have not been connected. Check with your care provider for current information about their services.",
  },
  {
    question: "Can MediQueue contact emergency services?",
    answer:
      "No. MediQueue does not dispatch emergency services and is not a substitute for emergency care or clinical advice. Contact your local emergency services directly if you need urgent help.",
  },
  {
    question: "Can I send a message through the contact form?",
    answer:
      "The form can check that required details are entered, but message delivery is not connected. Nothing is sent or stored.",
  },
] as const;
</script>
