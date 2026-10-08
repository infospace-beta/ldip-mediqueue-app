import axios from "axios";
import type { ApiErrorBody } from "@/types/models";

/**
 * Pull a displayable message out of whatever was thrown.
 *
 * In JavaScript every catch block did `err.response?.data?.message || ...`;
 * in TypeScript `err` is `unknown`, so that narrowing lives here once instead
 * of being repeated (and mistyped) in every store.
 */
export function apiMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    /**
     * Deliberately NOT error.message: axios says things like "Request failed
     * with status code 500", which is noise to a user. Either the API sent a
     * message worth showing, or the caller's fallback is better than both.
     */
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

/**Per-field messages from a 422, or an empty object */
export function apiFieldErrors(error: unknown): Record<string, string[]> {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.errors ?? {};
  }
  return {};
}

/**True when the response carried validation errors */
export function isValidationError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 422;
}
