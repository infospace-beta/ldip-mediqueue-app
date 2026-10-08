<template>
  <div class="page">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Posts</h1>
        <p class="mt-1 text-sm muted">
          Public list &middot; opening a post asks you to sign in first
        </p>
      </div>
      <BaseButton
        v-if="!auth.isLoggedIn"
        variant="ghost"
        size="sm"
        @click="router.push({ name: ROUTE_NAMES.login })"
      >
        Sign in to read
      </BaseButton>
    </header>

    <div class="mt-8">
      <StateLoading v-if="isLoading" label="Loading posts..." />
      <StateError v-else-if="error" :message="error" :on-retry="load" />
      <StateEmpty
        v-else-if="!posts.length"
        title="No posts yet"
        description="Run `npm run mock` to serve data/db.json, then reload."
      />
      <PostList v-else :posts="posts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import PostList from "@/components/posts/PostList.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import StateLoading from "@/components/ui/StateLoading.vue";
import StateEmpty from "@/components/ui/StateEmpty.vue";
import StateError from "@/components/ui/StateError.vue";
import { usePosts } from "@/composables/usePosts";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

const router = useRouter();
const auth = useAuthStore();
const { posts, error, isLoading, load } = usePosts();

onMounted(load);
</script>
