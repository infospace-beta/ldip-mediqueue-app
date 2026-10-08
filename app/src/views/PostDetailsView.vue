<template>
  <article class="page-narrow">
    <RouterLink
      :to="{ name: ROUTE_NAMES.posts }"
      class="text-sm muted hover:underline"
    >
      &larr; All posts
    </RouterLink>

    <StateLoading v-if="isLoading" class="mt-6" />
    <StateError
      v-else-if="error"
      class="mt-6"
      :message="error"
      :on-retry="load"
    />

    <div v-else-if="post" class="mt-6">
      <h1 class="text-3xl font-semibold tracking-tight">{{ post.title }}</h1>
      <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-2">
        <BaseBadge v-for="tag in post.tags" :key="tag">#{{ tag }}</BaseBadge>
      </div>
      <p class="mt-6 leading-relaxed text-gray-700 dark:text-gray-300">
        {{ post.body }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import StateLoading from "@/components/ui/StateLoading.vue";
import StateError from "@/components/ui/StateError.vue";
import { usePost } from "@/composables/usePosts";
import { ROUTE_NAMES } from "@/constants/routeNames";

const props = defineProps<{ id: string | number }>();

const { post, error, isLoading, load } = usePost(props.id);

onMounted(load);
</script>
