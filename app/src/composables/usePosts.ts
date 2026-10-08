import { ref } from "vue";
import { postsService } from "@/services/posts.service";
import { apiMessage } from "@/utils/errors";
import type { Post } from "@/types/models";

/**
 * Posts list state. Call `load()` from the consuming view (usually in onMounted).
 * This is the reference composable: state + a loader, no component knowledge.
 */
export const usePosts = () => {
  const posts = ref<Post[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await postsService.getAll();
      posts.value = data;
    } catch (err) {
      error.value = apiMessage(err, "Failed to load posts.");
      console.error("Error loading posts:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return { posts, error, isLoading, load };
};

/**Single post state, by id */
export const usePost = (id: string | number) => {
  const post = ref<Post | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await postsService.getById(id);
      post.value = data;
    } catch (err) {
      error.value = apiMessage(err, "Post not found.");
      console.error("Error loading post:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return { post, error, isLoading, load };
};
