<template>
  <header
    class="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90"
  >
    <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
      <RouterLink
        :to="{ name: ROUTE_NAMES.landing }"
        class="flex items-center gap-2 font-semibold"
      >
        <AppLogo />
      </RouterLink>

      <!-- Public navigation: reachable with or without a session -->
      <nav aria-label="Main" class="ml-auto hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="link in PUBLIC_LINKS"
          :key="link.name"
          :to="{ name: link.name }"
          class="rounded-md px-3 py-2 text-sm muted transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          active-class="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-2 md:ml-0">
        <BaseButton
          v-if="auth.isLoggedIn"
          variant="ghost"
          size="sm"
          class="hidden sm:inline-flex"
          @click="router.push({ name: ROUTE_NAMES.home })"
        >
          Dashboard
        </BaseButton>
        <BaseButton
          v-if="auth.isLoggedIn"
          variant="secondary"
          size="sm"
          @click="onLogout()"
        >
          Log out
        </BaseButton>
        <BaseButton
          v-else
          size="sm"
          @click="router.push({ name: ROUTE_NAMES.login })"
        >
          Log in
        </BaseButton>

        <!-- Mobile menu toggle: the nav above is hidden below md -->
        <button
          class="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden dark:text-gray-200 dark:hover:bg-gray-800"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span aria-hidden="true" class="block text-lg leading-none">
            {{ isMenuOpen ? "&times;" : "&#9776;" }}
          </span>
        </button>
      </div>
    </div>

    <nav
      v-show="isMenuOpen"
      id="mobile-nav"
      aria-label="Mobile"
      class="border-t border-gray-200 px-4 py-2 md:hidden dark:border-gray-800"
    >
      <RouterLink
        v-for="link in PUBLIC_LINKS"
        :key="link.name"
        :to="{ name: link.name }"
        class="block rounded-md px-3 py-2 text-sm muted hover:bg-gray-100 dark:hover:bg-gray-800"
        active-class="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
        @click="isMenuOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import AppLogo from "@/components/common/AppLogo.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const isMenuOpen = ref(false);

const PUBLIC_LINKS = [
  { name: ROUTE_NAMES.posts, label: "Posts" },
  { name: ROUTE_NAMES.jobs, label: "Jobs" },
  { name: ROUTE_NAMES.about, label: "About" },
  { name: ROUTE_NAMES.faq, label: "FAQ" },
  { name: ROUTE_NAMES.contact, label: "Contact" },
];

/**Close the drawer whenever navigation happens */
watch(
  () => route.fullPath,
  () => (isMenuOpen.value = false),
);

const onLogout = () => {
  auth.logout();
  router.push({ name: ROUTE_NAMES.landing });
};
</script>
