<template>
  <component :is="layout">
    <RouterView v-slot="{ Component: routeComponent }">
      <Transition
        :name="
          route.meta.requiresAuth || route.meta.guestOnly ? '' : 'public-page'
        "
        mode="out-in"
      >
        <component :is="routeComponent" :key="route.path" />
      </Transition>
    </RouterView>
  </component>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue";
import { RouterView, useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";

/**A route picks its shell with `meta: { layout: "auth" }`; default is the app chrome */
const LAYOUTS: Record<string, Component> = {
  default: DefaultLayout,
  auth: AuthLayout,
  blank: BlankLayout,
};

const route = useRoute();
const layout = computed(
  () => LAYOUTS[route.meta.layout ?? "default"] ?? DefaultLayout,
);
</script>
