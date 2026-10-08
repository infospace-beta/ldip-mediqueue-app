<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script setup lang="ts">
import PostCard from "@/components/posts/PostCard.vue";
import type { Post } from "@/types/models";

withDefaults(defineProps<{ posts?: Post[] }>(), { posts: () => [] });
</script>
