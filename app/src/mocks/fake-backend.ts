import axios, {
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ContactMessage, User } from "@/types/models";

/**
 * Fake backend, implemented as an axios adapter.
 *
 * It is installed on the http client when VITE_MODE=local (see services/http/client.ts),
 * so the app keeps exactly one data layer: components -> services -> axios. Requests this
 * file does not recognise fall through to the real adapter, which means json-server
 * (`npm run mock`) still answers /posts and /jobs while /login, /users and /contact
 * are faked here.
 */

const LATENCY_MS = 500;

/**The mock records keep a password; nothing leaves this file with one */
type MockUser = User & { password: string };

const users: MockUser[] = [
  {
    id: 1,
    username: "test@gmail.com",
    password: "test",
    firstName: "Test",
    lastName: "User",
  },
  {
    id: 2,
    username: "joekaranja@gmail.com",
    password: "joe123",
    firstName: "Joe",
    lastName: "Karanja",
  },
];

const TOKEN = "fake-jwt-token";

/**Strip the baseURL so routes can be matched on the path alone */
const pathOf = (config: InternalAxiosRequestConfig): string => {
  const url = config.url ?? "";
  return url.replace(config.baseURL ?? "", "").split("?")[0] ?? "";
};

const bodyOf = <T>(config: InternalAxiosRequestConfig): Partial<T> =>
  typeof config.data === "string"
    ? (JSON.parse(config.data) as T)
    : ((config.data as T) ?? ({} as T));

const isAuthenticated = (config: InternalAxiosRequestConfig): boolean =>
  config.headers?.Authorization === `Bearer ${TOKEN}`;

interface ErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

/**Shape a value the way axios shapes a real response */
const respond = <T>(
  config: InternalAxiosRequestConfig,
  status: number,
  data: T,
): Promise<AxiosResponse<T>> => {
  const response = {
    data,
    status,
    statusText: status >= 200 && status < 300 ? "OK" : "Error",
    headers: {},
    config,
  } as AxiosResponse<T>;

  if (status >= 200 && status < 300) return Promise.resolve(response);

  const message = (data as ErrorBody)?.message ?? "Request failed";
  return Promise.reject(
    Object.assign(new Error(message), {
      response,
      config,
      isAxiosError: true,
    }),
  );
};

interface MockRoute {
  method: string;
  path: string;
  handle: (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>;
}

/**Routes this fake backend answers. Anything else falls through to the network. */
const routes: MockRoute[] = [
  {
    method: "post",
    path: "/login",
    handle: (config) => {
      const { username, password } = bodyOf<{
        username: string;
        password: string;
      }>(config);

      const user = users.find(
        (x) => x.username === username && x.password === password,
      );

      if (!user) {
        return respond(config, 400, {
          message: "Username or password is incorrect",
        });
      }

      const { password: _password, ...safeUser } = user;
      return respond(config, 200, { user: safeUser, token: TOKEN });
    },
  },
  {
    method: "post",
    path: "/contact",
    handle: (config) => {
      const { name, email, message } = bodyOf<ContactMessage>(config);

      /**Mirrors how a real API answers: 422 with per-field messages */
      const errors: Record<string, string[]> = {};
      if (!name) errors.name = ["Please tell us your name."];
      if (!email) errors.email = ["We need an email to reply to."];
      if (email?.endsWith("@spam.test")) {
        errors.email = ["That domain is blocked."];
      }
      if (!message || message.length < 10) {
        errors.message = ["Please write at least 10 characters."];
      }

      if (Object.keys(errors).length > 0) {
        return respond(config, 422, {
          message: "Please check the highlighted fields.",
          errors,
        });
      }

      return respond(config, 201, { id: Date.now(), name, email, message });
    },
  },
  {
    method: "get",
    path: "/users",
    handle: (config) => {
      if (!isAuthenticated(config)) {
        return respond(config, 401, { message: "Unauthorized" });
      }
      return respond(
        config,
        200,
        users.map(({ password: _password, ...user }) => user),
      );
    },
  },
];

export const fakeBackendAdapter: AxiosAdapter = (config) => {
  const path = pathOf(config);
  const method = (config.method ?? "get").toLowerCase();
  const route = routes.find((r) => r.method === method && r.path === path);

  /**Not a faked route - hand it to the real adapter */
  if (!route) {
    return axios.getAdapter(["xhr", "http"])(config);
  }

  /**Delay a little so loading states are actually visible */
  return new Promise((resolve) => setTimeout(resolve, LATENCY_MS)).then(() =>
    route.handle(config),
  );
};
