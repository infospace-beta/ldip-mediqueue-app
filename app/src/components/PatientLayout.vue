<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import TopNavbar from './TopNavbar.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)
const title = computed(() => route.meta.title || 'Patient portal')
</script>

<template>
  <div class="app-shell">
    <Sidebar :open="mobileMenuOpen" @close="mobileMenuOpen = false" />
    <div class="main-shell">
      <TopNavbar :title="title" @toggle-menu="mobileMenuOpen = !mobileMenuOpen" />
      <main class="page-content" id="main-content">
        <RouterView v-slot="{ Component, route: activeRoute }">
          <Transition name="page-fade" mode="out-in"><component :is="Component" :key="activeRoute.path" /></Transition>
        </RouterView>
      </main>
      <footer class="app-footer"><span>MediQueue · Patient portal</span><span>Prototype · Live services not connected</span></footer>
    </div>
  </div>
</template>