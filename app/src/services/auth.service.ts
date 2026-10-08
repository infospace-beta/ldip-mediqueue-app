import api from "@/services/http/client";
import type { AuthSession } from "@/types/models";

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Auth endpoints.
 * In local mode these are answered by src/mocks/fake-backend.ts.
 */
export const authService = {
  /**Exchange credentials for a user + token */
  login: ({ email, password }: LoginCredentials) =>
    api.post<AuthSession>("/login", { username: email, password }),
};
