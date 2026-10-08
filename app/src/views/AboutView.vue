<template>
  <div class="page-narrow">
    <h1 class="text-3xl font-semibold tracking-tight">About this template</h1>
    <p class="mt-3 text-lg muted">
      A public page: no session needed, no guard in front of it. Use these as
      the shape for marketing or documentation pages that sit in front of the
      app.
    </p>

    <div class="mt-10 grid gap-5 sm:grid-cols-2">
      <BaseCard v-for="item in SECTIONS" :key="item.title">
        <h2 class="font-semibold">{{ item.title }}</h2>
        <p class="mt-2 text-sm muted">{{ item.body }}</p>
      </BaseCard>
    </div>

    <div class="mt-10 flex flex-wrap gap-3">
      <BaseButton @click="router.push({ name: ROUTE_NAMES.posts })">
        Browse posts
      </BaseButton>
      <BaseButton
        variant="ghost"
        @click="router.push({ name: ROUTE_NAMES.contact })"
      >
        Get in touch
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const router = useRouter();

const SECTIONS = [
  {
    title: "Layered structure",
    body: "services/ talks to the network, stores/ holds shared state, composables/ hold view state, components/ui stays dumb.",
  },
  {
    title: "One data layer",
    body: "A single axios client with interceptors; the fake backend is installed as an adapter when VITE_MODE=local.",
  },
  {
    title: "Public and private routes",
    body: "meta.requiresAuth drives the guard. Lists here are public; detail pages ask you to sign in first.",
  },
  {
    title: "Tested",
    body: "Vitest specs sit beside what they test, covering the guard, stores, mocks and UI components.",
  },
  {
    title: "Typed end to end",
    body: "API shapes live in types/models.ts and flow through services, stores and views; route meta is typed too.",
  },
];
</script>
