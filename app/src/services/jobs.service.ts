import api from "@/services/http/client";
import type { Job } from "@/types/models";

export const jobsService = {
  getAll: () => api.get<Job[]>("/jobs"),
  getById: (id: string | number) => api.get<Job>(`/jobs/${id}`),
};
