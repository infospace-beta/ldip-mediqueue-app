<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import "../assets/styles/patient-portal.css";
import Sidebar from "./Sidebar.vue";
import TopNavbar from "./TopNavbar.vue";

const route = useRoute();
const mobileMenuOpen = ref(false);
const sidebar = ref(null);
const topNavbar = ref(null);

const title = computed(() => route.meta.title || "Patient portal");

function handleKeydown(event) {
  if (
    event.key !== "Escape" ||
    !mobileMenuOpen.value ||
    (event.target instanceof Element &&
      event.target.closest(".confirmation-backdrop"))
  ) return;
  mobileMenuOpen.value = false;
}

watch(mobileMenuOpen, async (isOpen, wasOpen) => {
  await nextTick();
  if (isOpen) sidebar.value?.focusInitial();
  else if (wasOpen) topNavbar.value?.focusMenuTrigger();
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">
      Skip to main content
    </a>

    <Sidebar
      ref="sidebar"
      :open="mobileMenuOpen"
      @close="mobileMenuOpen = false"
    />

    <div class="main-shell">
      <TopNavbar
        ref="topNavbar"
        :title="title"
        :menu-open="mobileMenuOpen"
        @toggle-menu="mobileMenuOpen = !mobileMenuOpen"
      />

      <main id="main-content" class="page-content">
        <RouterView v-slot="{ Component, route: activeRoute }">
          <Transition name="page-fade" mode="out-in">
            <component
              :is="Component"
              :key="activeRoute.path"
            />
          </Transition>
        </RouterView>
      </main>

      <footer class="app-footer">
        <span>MediQueue · Patient portal</span>
        <span>Healthcare queue management system</span>
      </footer>
    </div>
  </div>
</template>
