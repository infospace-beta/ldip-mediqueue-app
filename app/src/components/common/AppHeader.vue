<template>
  <header
    class="sticky top-0 z-40 border-b border-[#e3ece9] bg-white/95 backdrop-blur"
    @keydown.esc="onEscape"
  >
    <div
      class="mx-auto flex min-h-[76px] max-w-7xl items-center gap-2 px-5 sm:min-h-[80px] sm:gap-5 sm:px-8 lg:px-12"
    >
      <RouterLink
        :to="{ name: ROUTE_NAMES.landing }"
        class="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f6b]"
        aria-label="MediQueue home"
      >
        <AppLogo size="lg" />
      </RouterLink>

      <nav
        aria-label="Main navigation"
        class="ml-auto hidden items-center gap-1.5 xl:flex"
      >
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :to="link.to"
          class="rounded-lg px-3 py-2.5 text-sm font-medium tracking-[0.01em] text-[#425e63] transition hover:bg-[#f2f8f7] hover:text-[#102f3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          :class="{ 'bg-[#f2f8f7] text-[#102f3b]': isActive(link) }"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-1 sm:gap-2 xl:ml-0">
        <RouterLink
          v-if="!auth.isLoggedIn"
          :to="{ name: ROUTE_NAMES.login }"
          class="hidden min-h-10 items-center justify-center rounded-lg px-2 py-2 text-xs font-semibold text-[#102f3b] transition hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b] sm:inline-flex sm:px-3 sm:text-sm"
        >
          Login
        </RouterLink>
        <RouterLink
          v-if="!auth.isLoggedIn"
          :to="{ name: ROUTE_NAMES.signup }"
          class="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#087f6b] px-2 py-2 text-xs font-semibold text-white transition hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b] sm:px-4 sm:text-sm"
        >
          Get started
        </RouterLink>
        <template v-else>
          <RouterLink
            :to="{ name: ROUTE_NAMES.home }"
            class="hidden min-h-10 items-center justify-center rounded-lg bg-[#087f6b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#066c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b] sm:inline-flex"
          >
            Dashboard
          </RouterLink>
          <span class="hidden sm:block">
            <LogoutAction
              button-class="inline-flex min-h-9 items-center justify-center rounded-lg border-0 px-3 py-2 text-sm font-semibold text-[#425e63] transition-colors hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
            >
              Log out
            </LogoutAction>
          </span>
        </template>
        <button
          ref="mobileMenuButton"
          type="button"
          class="grid h-10 w-10 place-items-center rounded-lg text-[#102f3b] transition hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b] xl:hidden"
          :aria-expanded="isMobileNavigationOpen"
          aria-controls="public-mobile-navigation"
          :aria-label="
            isMobileNavigationOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          "
          @click="isMobileNavigationOpen = !isMobileNavigationOpen"
        >
          <X v-if="isMobileNavigationOpen" :size="20" aria-hidden="true" />
          <Menu v-else :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>

    <nav
      v-show="isMobileNavigationOpen"
      id="public-mobile-navigation"
      aria-label="Mobile navigation"
      class="border-t border-[#e3ece9] bg-white xl:hidden"
    >
      <div class="mx-auto grid max-w-7xl gap-1 px-5 py-3 sm:px-8">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-[#425e63] hover:bg-[#f2f8f7] hover:text-[#102f3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          :class="{ 'bg-[#f2f8f7] text-[#102f3b]': isActive(link) }"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
        <template v-if="auth.isLoggedIn">
          <RouterLink
            :to="{ name: ROUTE_NAMES.home }"
            class="rounded-lg px-3 py-2 text-sm font-semibold text-[#087f6b] hover:bg-[#f2f8f7]"
          >
            Dashboard
          </RouterLink>
          <LogoutAction
            button-class="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#425e63] hover:bg-[#f2f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]"
          >
            Log out
          </LogoutAction>
        </template>
        <template v-else>
          <RouterLink
            :to="{ name: ROUTE_NAMES.login }"
            class="rounded-lg px-3 py-2 text-sm font-semibold text-[#425e63] hover:bg-[#f2f8f7]"
          >
            Login
          </RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Menu, X } from "@lucide/vue";
import {
  RouterLink,
  useRoute,
  useRouter,
  type RouteLocationRaw,
} from "vue-router";
import AppLogo from "@/components/common/AppLogo.vue";
import LogoutAction from "@/components/common/LogoutAction.vue";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const isMobileNavigationOpen = ref(false);
const mobileMenuButton = ref<HTMLButtonElement | null>(null);

const NAV_LINKS: { label: string; to: RouteLocationRaw }[] = [
  { label: "Home", to: { name: ROUTE_NAMES.landing } },
  { label: "How it works", to: { name: ROUTE_NAMES.howItWorks } },
  { label: "Features", to: { name: ROUTE_NAMES.features } },
  { label: "About", to: { name: ROUTE_NAMES.about } },
  { label: "Contact", to: { name: ROUTE_NAMES.contact } },
  { label: "FAQs", to: { name: ROUTE_NAMES.faq } },
];

watch(
  () => route.fullPath,
  () => closeMobileNavigation(true),
);

function isActive(link: (typeof NAV_LINKS)[number]) {
  const target = router.resolve(link.to);
  return route.path === target.path && route.hash === target.hash;
}

function closeMobileNavigation(restoreFocus = false) {
  const wasOpen = isMobileNavigationOpen.value;
  isMobileNavigationOpen.value = false;
  if (restoreFocus && wasOpen) {
    requestAnimationFrame(() => mobileMenuButton.value?.focus());
  }
}

function onEscape() {
  closeMobileNavigation(true);
}
</script>
