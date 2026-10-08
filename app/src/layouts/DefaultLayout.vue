<template>
  <div class="flex min-h-screen flex-col bg-white dark:bg-gray-950">
    <AppHeader />
    <!-- The header is sticky, so the page needs no top offset -->
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
</script>
