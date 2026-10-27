<template>
  <header
    class="sticky top-0 z-40 border-b border-[#e3ece9] bg-white/95 backdrop-blur"
  >
    <div
      class="mx-auto flex min-h-[76px] max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-8 lg:px-12"
    >
      <RouterLink
        :to="{ name: ROUTE_NAMES.landing }"
        class="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f6b]"
        aria-label="MediQueue home"
      >
        <AppLogo />
      </RouterLink>

      <nav aria-label="Main navigation" class="ml-auto hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-[#425e63] transition hover:bg-[#f2f8f7] hover:text-[#102f3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          :class="{ 'bg-[#f2f8f7] text-[#102f3b]': isActive(link) }"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-1 sm:gap-2">
        <RouterLink
          v-if="!auth.isLoggedIn"
          :to="{ name: ROUTE_NAMES.login }"
          class="inline-flex min-h-10 items-center justify-center rounded-lg px-2 py-2 text-xs font-semibold text-[#102f3b] transition hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b] sm:px-3 sm:text-sm"
        >
          Login
        </RouterLink>
        <RouterLink
          v-if="!auth.isLoggedIn"
          to="/patient/join-queue"
          class="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#087f6b] px-2 py-2 text-xs font-semibold text-white transition hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b] sm:px-4 sm:text-sm"
        >
          Get started
        </RouterLink>
        <template v-else>
          <RouterLink
            :to="{ name: ROUTE_NAMES.home }"
            class="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#087f6b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Dashboard
          </RouterLink>
          <BaseButton
            variant="ghost"
            size="sm"
            class="border-0 text-[#425e63] hover:bg-[#f2f8f7]"
            @click="onLogout"
          >
            Log out
          </BaseButton>
        </template>
      </div>
    </div>

    <nav aria-label="Mobile navigation" class="border-t border-[#e3ece9] bg-white lg:hidden">
      <div class="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-2 sm:px-8">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :to="link.to"
          class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-[#425e63] hover:bg-[#f2f8f7] hover:text-[#102f3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          :class="{ 'bg-[#f2f8f7] text-[#102f3b]': isActive(link) }"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter, type RouteLocationRaw } from "vue-router";
import AppLogo from "@/components/common/AppLogo.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const NAV_LINKS: { label: string; to: RouteLocationRaw }[] = [
  { label: "Home", to: { name: ROUTE_NAMES.landing } },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Features", to: "/#services" },
  { label: "About", to: { name: ROUTE_NAMES.about } },
];

function isActive(link: (typeof NAV_LINKS)[number]) {
  const target = router.resolve(link.to);
  return route.path === target.path && route.hash === target.hash;
}

function onLogout() {
  auth.logout();
  router.push({ name: ROUTE_NAMES.landing });
}
</script>
