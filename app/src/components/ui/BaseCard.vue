<template>
  <component
    :is="to ? RouterLink : 'div'"
    :to="to"
    :class="[
      'block rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
      to ? 'transition hover:border-brand-500 hover:shadow-md' : '',
    ]"
  >
    <header
      v-if="title || $slots.header"
      class="border-b border-gray-200 px-5 py-4 dark:border-gray-800"
    >
      <slot name="header">
        <h2 class="font-semibold">{{ title }}</h2>
      </slot>
    </header>

    <div :class="padded ? 'p-5' : ''">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="border-t border-gray-200 px-5 py-4 dark:border-gray-800"
    >
      <slot name="footer" />
    </footer>
  </component>
</template>

<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from "vue-router";

/**Pass `to` to turn the whole card into a router link */
withDefaults(
  defineProps<{
    title?: string;
    to?: RouteLocationRaw;
    padded?: boolean;
  }>(),
  { padded: true },
);
</script>
