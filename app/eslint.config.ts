
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import globals from "globals";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
    ],
  },
  {
    name: "app/languages",
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
    },
  },
  js.configs.recommended,
  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    name: "app/rules",
    rules: {
      /** Views and layouts are legitimately single-word */
      "vue/multi-word-component-names": "off",

      /** Type-based props already express optionality */
      "vue/require-default-prop": "off",

      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      /** Type-only imports keep the runtime bundle honest */
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
  {
    name: "app/javascript-vue-components",
    files: [
      "src/components/JoinQueueForm.vue",
      "src/components/PatientLayout.vue",
      "src/components/QueueCard.vue",
      "src/components/Sidebar.vue",
      "src/components/StatusBadge.vue",
      "src/components/SummaryCard.vue",
      "src/views/AppointmentsPage.vue",
      "src/views/DashboardPage.vue",
      "src/views/EmergencyPage.vue",
      "src/views/HistoryPage.vue",
      "src/views/JoinQueuePage.vue",
      "src/views/NotificationsPage.vue",
      "src/views/ProfilePage.vue",
      "src/views/QueuePage.vue",
      "src/views/SettingsPage.vue",
    ],
    rules: {
      "vue/block-lang": "off",
    },
  },
);
