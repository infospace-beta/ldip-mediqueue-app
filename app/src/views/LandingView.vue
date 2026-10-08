<template>
  <div>
    <!-- Hero -->
    <section
      class="border-b border-gray-200 bg-gradient-to-b from-brand-50 to-white dark:border-gray-800 dark:from-gray-900 dark:to-gray-950"
    >
      <div class="page text-center sm:py-20">
        <BaseBadge tone="brand">Vue 3 &middot; Vite &middot; Pinia</BaseBadge>
        <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Vue Template TS
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg muted">
          The same starter in TypeScript: one typed axios data layer, a guarded
          router and a swappable fake backend. Everything below is reachable
          without an account - sign in when you want the parts behind the guard.
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <BaseButton
            size="lg"
            @click="router.push({ name: ROUTE_NAMES.posts })"
          >
            Browse posts
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="lg"
            @click="router.push({ name: ROUTE_NAMES.about })"
          >
            How it works
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- What is where -->
    <section class="page">
      <div class="grid gap-5 sm:grid-cols-2">
        <BaseCard v-for="area in AREAS" :key="area.title">
          <div class="flex items-start justify-between gap-3">
            <h2 class="font-semibold">{{ area.title }}</h2>
            <BaseBadge :tone="area.tone">{{ area.badge }}</BaseBadge>
          </div>
          <p class="mt-2 text-sm muted">{{ area.body }}</p>
          <ul class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li v-for="link in area.links" :key="link.name">
              <RouterLink
                :to="{ name: link.name }"
                class="font-medium text-brand-600 hover:underline dark:text-brand-200"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </BaseCard>
      </div>

      <div class="mt-10 grid gap-6 sm:grid-cols-3">
        <div v-for="item in HIGHLIGHTS" :key="item.title">
          <h3 class="font-medium">{{ item.title }}</h3>
          <p class="mt-1 text-sm muted">{{ item.body }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseBadge, { type BadgeTone } from "@/components/ui/BaseBadge.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const router = useRouter();

/**Mirrors router/routes.ts so the access split is visible from the first screen */
const AREAS: {
  title: string;
  badge: string;
  tone: BadgeTone;
  body: string;
  links: { name: string; label: string }[];
}[] = [
  {
    title: "Public",
    badge: "No account",
    tone: "success",
    body: "No session required. Lists are readable by anyone.",
    links: [
      { name: ROUTE_NAMES.posts, label: "Posts" },
      { name: ROUTE_NAMES.jobs, label: "Jobs" },
      { name: ROUTE_NAMES.about, label: "About" },
      { name: ROUTE_NAMES.faq, label: "FAQ" },
      { name: ROUTE_NAMES.contact, label: "Contact" },
    ],
  },
  {
    title: "Behind the guard",
    badge: "Sign in",
    tone: "warning",
    body: "Opening one of these signed out sends you to the login page and back again afterwards.",
    links: [
      { name: ROUTE_NAMES.home, label: "Dashboard" },
      { name: ROUTE_NAMES.apiTest, label: "API test" },
    ],
  },
];

const HIGHLIGHTS = [
  {
    title: "One data layer",
    body: "A single axios client with interceptors; the fake backend is installed as an adapter, not a second code path.",
  },
  {
    title: "Layered structure",
    body: "services/ talks to the network, stores/ holds shared state, components/ui stays dumb.",
  },
  {
    title: "Tested",
    body: "Vitest specs sit beside what they test, covering the guard, stores, mocks and UI.",
  },
];
</script>
