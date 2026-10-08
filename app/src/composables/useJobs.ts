import { ref } from "vue";
import { jobsService } from "@/services/jobs.service";
import { apiMessage } from "@/utils/errors";
import type { Job } from "@/types/models";

/**Jobs list state */
export const useJobs = () => {
  const jobs = ref<Job[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await jobsService.getAll();
      jobs.value = data;
    } catch (err) {
      error.value = apiMessage(err, "Failed to load jobs.");
      console.error("Error loading jobs:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return { jobs, error, isLoading, load };
};

/**Single job state, by id */
export const useJob = (id: string | number) => {
  const job = ref<Job | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await jobsService.getById(id);
      job.value = data;
    } catch (err) {
      error.value = apiMessage(err, "Job not found.");
      console.error("Error loading job:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return { job, error, isLoading, load };
};
