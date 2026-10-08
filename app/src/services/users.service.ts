import api from "@/services/http/client";
import type { User } from "@/types/models";

export const usersService = {
  getAll: () => api.get<User[]>("/users"),
  getById: (id: string | number) => api.get<User>(`/users/${id}`),
};
