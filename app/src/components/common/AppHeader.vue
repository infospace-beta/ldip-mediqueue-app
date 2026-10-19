<template>
  <header
    class="sticky top-0 z-40 border-b border-[#e3ece9] bg-white/95 backdrop-blur"
  >
    <div
      class="mx-auto flex min-h-[76px] max-w-7xl items-center gap-4 px-5 sm:px-8 lg:px-12"
    >
      <RouterLink
        :to="{ name: ROUTE_NAMES.landing }"
        class="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f6b]"
        aria-label="MediQueue home"
      >
        <AppLogo />
      </RouterLink>

      <nav
        aria-label="Main navigation"
        class="ml-auto hidden items-center gap-1 lg:flex"
      >
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-[#425e63] transition hover:bg-[#f2f8f7] hover:text-[#102f3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          active-class="bg-[#f2f8f7] text-[#102f3b]"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto hidden items-center gap-2 lg:flex">
        <RouterLink
          to="/patient/dashboard"
          class="inline-flex min-h-10 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-[#087f6b] transition hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
        >
          Patient portal
        </RouterLink>
        <RouterLink
          v-if="!auth.isLoggedIn"
          :to="{ name: ROUTE_NAMES.login }"
          class="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#087f6b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
        >
          Sign in
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

      <button
        class="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#102f3b] transition hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b] lg:hidden"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-nav"
        :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        @click="isMenuOpen = !isMenuOpen"
      >
        <X v-if="isMenuOpen" :size="21" aria-hidden="true" />
        <Menu v-else :size="21" aria-hidden="true" />
      </button>
    </div>

    <nav
      v-if="isMenuOpen"
      id="mobile-nav"
      aria-label="Mobile navigation"
      class="border-t border-[#e3ece9] bg-white px-5 py-3 sm:px-8 lg:hidden"
    >
      <div class="mx-auto grid max-w-7xl gap-1">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :to="link.to"
          class="rounded-lg px-3 py-3 text-sm font-medium text-[#425e63] hover:bg-[#f2f8f7] hover:text-[#102f3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          active-class="bg-[#f2f8f7] text-[#102f3b]"
          @click="isMenuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink
          to="/patient/dashboard"
          class="rounded-lg px-3 py-3 text-sm font-semibold text-[#087f6b] hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          @click="isMenuOpen = false"
        >
          Patient portal
        </RouterLink>
        <RouterLink
          v-if="!auth.isLoggedIn"
          :to="{ name: ROUTE_NAMES.login }"
          class="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#087f6b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          @click="isMenuOpen = false"
        >
          Sign in
        </RouterLink>
        <template v-else>
          <RouterLink
            :to="{ name: ROUTE_NAMES.home }"
            class="rounded-lg px-3 py-3 text-sm font-semibold text-[#087f6b] hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
            @click="isMenuOpen = false"
          >
            Dashboard
          </RouterLink>
          <button
            class="rounded-lg px-3 py-3 text-left text-sm font-semibold text-[#425e63] hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
            type="button"
            @click="onLogout"
          >
            Log out
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterLink, useRoute, useRouter, type RouteLocationRaw } from "vue-router";
import { Menu, X } from "@lucide/vue";
import AppLogo from "@/components/common/AppLogo.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const isMenuOpen = ref(false);

const NAV_LINKS: { label: string; to: RouteLocationRaw }[] = [
  { label: "Join a queue", to: "/patient/join-queue" },
  { label: "Appointments", to: "/patient/appointments" },
  { label: "About", to: { name: ROUTE_NAMES.about } },
  { label: "Contact", to: { name: ROUTE_NAMES.contact } },
];

watch(
  () => route.fullPath,
  () => (isMenuOpen.value = false),
);

function onLogout() {
  auth.logout();
  isMenuOpen.value = false;
  router.push({ name: ROUTE_NAMES.landing });
}
</script>
