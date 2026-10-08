import api from "@/services/http/client";
import type { Post } from "@/types/models";

export const postsService = {
  getAll: () => api.get<Post[]>("/posts"),
  getById: (id: string | number) => api.get<Post>(`/posts/${id}`),
};
