<script setup lang="ts">
import SearchBar from './SearchBar.vue'

interface Profile {
  name: string
  role: string
  initials: string
  department?: string
}

defineProps<{
  title: string
  department: string
  notificationCount: number
  profile: Profile
  searchValue?: string
  theme: 'light' | 'dark'
}>()

defineEmits<{ (e: 'toggle-sidebar'): void; (e: 'toggle-theme'): void; (e: 'search-change', value: string): void }>()
</script>

<template>
  <header class="topbar">
    <div class="topbar__group topbar__group--left">
      <button type="button" class="topbar__menu" aria-label="Toggle sidebar" @click="$emit('toggle-sidebar')">
        ☰
      </button>
      <img class="topbar__brand-mark" src="/mediqueue-mark.svg" alt="" aria-hidden="true" />
      <div>
        <p class="eyebrow">MediQueue</p>
        <h1>{{ title }}</h1>
      </div>
    </div>

    <div class="topbar__group topbar__group--right">
      <SearchBar
        :model-value="searchValue ?? ''"
        placeholder="Search patient or queue"
        @update:model-value="$emit('search-change', $event)"
      />

      <button type="button" class="icon-button" aria-label="Notifications">
        🔔
        <span v-if="notificationCount > 0" class="notification-dot">{{ notificationCount }}</span>
      </button>

      <button type="button" class="theme-toggle" aria-label="Toggle dark mode" @click="$emit('toggle-theme')">
        {{ theme === 'light' ? '🌙' : '☀️' }}
      </button>

      <div class="header-alert" aria-label="Emergency alert">
        <span class="header-alert__dot" aria-hidden="true"></span>
        Alert
      </div>

      <div class="header-profile">
        <div class="header-profile__avatar">{{ profile.initials }}</div>
        <div class="header-profile__meta">
          <strong>{{ profile.name }}</strong>
          <span>{{ department }}</span>
        </div>
      </div>
    </div>
  </header>
</template>
