<template>
  <div class="page-narrow">
    <h1 class="text-3xl font-semibold tracking-tight">FAQ</h1>
    <p class="mt-3 text-lg muted">
      Another public page, and the accordion pattern without a UI library.
    </p>

    <dl
      class="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800"
    >
      <div v-for="(item, index) in FAQS" :key="item.question">
        <dt>
          <button
            class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
            :aria-expanded="openIndex === index"
            :aria-controls="`faq-answer-${index}`"
            @click="toggle(index)"
          >
            {{ item.question }}
            <span
              aria-hidden="true"
              class="muted text-xl leading-none transition-transform"
              :class="openIndex === index ? 'rotate-45' : ''"
            >
              +
            </span>
          </button>
        </dt>
        <dd
          v-show="openIndex === index"
          :id="`faq-answer-${index}`"
          class="muted px-5 pb-5 text-sm leading-relaxed"
        >
          {{ item.answer }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const openIndex = ref(0);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index;
};

const FAQS = [
  {
    question: "Do I need to log in to look around?",
    answer:
      "No. The landing, about, FAQ, contact and list pages are public. Detail pages and the dashboard require a session, which is what meta.requiresAuth in router/routes.js controls.",
  },
  {
    question: "Where does the demo data come from?",
    answer:
      "With VITE_MODE=local, src/mocks/fake-backend.js answers /login, /users and /contact as an axios adapter. Everything else falls through to VITE_API_URL, where json-server serves data/db.json via npm run mock.",
  },
  {
    question: "How do I add a page?",
    answer:
      "Add a view in src/views, a name in src/constants/routeNames.js and a lazy entry in src/router/routes.js. Leave meta.requiresAuth off and the page is public.",
  },
  {
    question: "How do I turn the mock backend off?",
    answer:
      "Set VITE_MODE=remote in .env and point VITE_API_URL at your API. Nothing else in the app changes - the client is the same either way.",
  },
];
</script>
