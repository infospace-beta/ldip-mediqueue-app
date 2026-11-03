<template>
  <component
    :is="to ? RouterLink : 'div'"
    :to="to"
    :class="[
      'block rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-primary)] shadow-sm',
      to ? 'transition hover:border-brand-500 hover:shadow-md' : '',
    ]"
  >
    <header
      v-if="title || $slots.header"
      class="border-b border-[var(--app-border)] px-5 py-4"
    >
      <slot name="header">
        <h2 class="font-semibold text-[var(--app-text-primary)]">
          {{ title }}
        </h2>
      </slot>
    </header>

    <div :class="padded ? 'p-5' : ''">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="border-t border-[var(--app-border)] px-5 py-4"
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
