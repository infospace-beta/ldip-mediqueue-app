<template>
  <section
    class="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
  >
    <p class="text-6xl font-semibold tracking-tight">404</p>
    <p class="muted">This page does not exist.</p>
    <div class="mt-2 flex gap-2">
      <BaseButton @click="router.push({ name: ROUTE_NAMES.landing })">
        Back to home
      </BaseButton>
      <BaseButton
        variant="ghost"
        @click="router.push({ name: ROUTE_NAMES.contact })"
      >
        Report a broken link
      </BaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/BaseButton.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const router = useRouter();
</script>
