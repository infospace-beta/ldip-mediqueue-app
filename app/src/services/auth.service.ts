
import api from "@/services/http/client";
import { supabase } from "@/services/supabase";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BackendLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface BackendCurrentUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  hospitalId: number | null;
}

export interface PatientRegistration {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

export const authService = {
  // Authenticate credentials with Supabase first.
  login: async ({ email, password }: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    const accessToken = data.session?.access_token;

    if (!accessToken) {
      throw new Error(
        "Supabase did not return an access token."
      );
    }

    // Exchange the verified Supabase token for a MediQueue JWT.
    return authService.exchangeSupabaseToken(accessToken);
  },

  // Exchange Supabase access token with Spring Boot.
  exchangeSupabaseToken: (accessToken: string) =>
    api.post<BackendLoginResponse>(
      "/api/v1/auth/supabase/exchange",
      { accessToken },
    ),

  getCurrentUser: () =>
    api.get<BackendCurrentUser>("/api/v1/auth/me"),

  registerPatient: (registration: PatientRegistration) =>
    api.post<string>("/api/v1/auth/register", registration),
};
