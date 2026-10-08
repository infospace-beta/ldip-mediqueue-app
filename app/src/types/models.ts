/**
 * The shapes the API deals in.
 *
 * This template keeps them in one place rather than per-feature because the
 * structure is layered, not feature-sliced - services, stores and components
 * all import from here.
 */

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  /**Only ever present on the mock records, never on an API response */
  password?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags?: string[];
}

export interface Job {
  id: number;
  title: string;
  details: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface ContactReceipt extends ContactMessage {
  id: number;
}

/**What an API error body looks like once axios has parsed it */
export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}
