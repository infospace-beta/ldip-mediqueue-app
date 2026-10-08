<template>
  <div class="page-narrow max-w-xl">
    <h1 class="text-3xl font-semibold tracking-tight">Contact us</h1>
    <p class="muted mt-3">
      A public page that still talks to the API: validation runs in the browser,
      and the server's own field errors are shown when it disagrees.
    </p>

    <BaseCard class="mt-8">
      <div
        v-if="isSent"
        class="flex flex-col items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30"
        role="status"
      >
        <p class="font-medium text-green-800 dark:text-green-200">
          Thanks - your message is on its way.
        </p>
        <BaseButton variant="ghost" size="sm" @click="isSent = false">
          Send another
        </BaseButton>
      </div>

      <form v-else class="flex flex-col gap-5" @submit.prevent="onSubmit">
        <BaseInput
          id="contact-name"
          v-model="form.name"
          label="Your name"
          :errors="errorsFor('name')"
        />
        <BaseInput
          id="contact-email"
          v-model="form.email"
          label="Email"
          type="email"
          :errors="errorsFor('email')"
        />

        <div class="w-full">
          <label for="contact-message" class="mb-1 block text-sm font-medium">
            Message
          </label>
          <textarea
            id="contact-message"
            v-model="form.message"
            rows="5"
            :class="[
              'w-full rounded-lg border p-3 text-sm dark:bg-gray-950',
              errorsFor('message').length
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700',
            ]"
          />
          <p
            v-if="errorsFor('message').length"
            class="mt-1 text-sm text-red-600"
          >
            <span
              v-for="(messageError, index) in errorsFor('message')"
              :key="fieldErrorKey(messageError, index)"
            >
              {{ fieldErrorMessage(messageError) }}
            </span>
          </p>
        </div>

        <p v-if="error" class="text-sm text-red-600" role="alert">
          {{ error }}
        </p>

        <BaseButton type="submit" block :loading="isSending">
          Send message
        </BaseButton>
      </form>
    </BaseCard>

    <p class="muted mt-4 text-xs">
      Try an <code>@spam.test</code> address to see the server's 422 land back
      on the field.
    </p>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { useContactForm } from "@/composables/useContactForm";
import {
  fieldErrorKey,
  fieldErrorMessage,
  type FieldError,
} from "@/utils/fieldErrors";

const { form, v$, isSending, isSent, error, fieldErrors, submit } =
  useContactForm();

/**Client-side rules first, then whatever the server said about that field */
type ContactField = keyof typeof form;

const errorsFor = (field: ContactField): FieldError[] => [
  ...v$.value[field].$errors,
  ...(fieldErrors.value[field] ?? []),
];

const onSubmit = () => submit();
</script>
