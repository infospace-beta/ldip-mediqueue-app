<template>
  <BaseCard :to="{ name: ROUTE_NAMES.postDetails, params: { id: post.id } }">
    <h3 class="font-semibold">{{ post.title }}</h3>
    <p class="mt-2 text-sm muted">{{ snippet }}</p>

    <div v-if="post.tags?.length" class="mt-4 flex flex-wrap gap-2">
      <BaseBadge v-for="tag in post.tags" :key="tag">#{{ tag }}</BaseBadge>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";
import type { Post } from "@/types/models";
import { truncate } from "@/utils/format";

const props = defineProps<{ post: Post }>();

const snippet = computed(() => truncate(props.post.body, 120));
</script>
