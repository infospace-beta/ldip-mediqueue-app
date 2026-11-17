import api from "@/services/http/client";


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
  login: ({ email, password }: LoginCredentials) =>
    api.post<BackendLoginResponse>("/api/v1/auth/login", {
      usernameOrEmail: email,
      password,
    }),

  getCurrentUser: () =>
    api.get<BackendCurrentUser>("/api/v1/auth/me"),

  registerPatient: (registration: PatientRegistration) =>
    api.post<string>("/api/v1/auth/register", registration),
};
