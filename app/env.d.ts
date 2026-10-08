/// <reference types="vite/client" />

/**
 * Typed environment variables, so `import.meta.env.VITE_MODE` is checked rather
 * than `any`. Keep this in sync with .env.example.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MODE: "local" | "remote";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, unknown, unknown>;
  export default component;
}
