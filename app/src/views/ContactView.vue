<template>
  <div class="overflow-hidden bg-white text-[#102f3b]">
    <section class="bg-[#f2f8f7]">
      <div
        class="mx-auto grid max-w-8xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-12 lg:py-20"
      >
        <div class="public-reveal max-w-xl">
          <p
            class="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#087f6b]"
          >
            <span class="h-px w-8 bg-[#087f6b]" aria-hidden="true"></span>
            Contact MediQueue
          </p>
          <h1
            class="mt-6 text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl"
          >
            We’re listening.
          </h1>
          <p
            class="mt-6 max-w-lg text-base leading-7 text-[#536c72] sm:text-lg sm:leading-8"
          >
            Have a question about MediQueue? Use this form to check your message
            before sending it.
          </p>

          <aside
            class="mt-9 border-l-2 border-[#087f6b] py-1 pl-5"
            aria-labelledby="contact-status-heading"
          >
            <p
              id="contact-status-heading"
              class="text-xs font-bold uppercase tracking-[0.16em] text-[#087f6b]"
            >
              Message delivery is not connected
            </p>
            <p class="mt-3 leading-7 text-[#536c72]">
              This form does not send or store messages. Please do not include
              sensitive health or personal information.
            </p>
          </aside>

          <div class="mt-8 border-t border-[#dce9e7] pt-5">
            <p class="text-sm font-semibold">Looking for an answer?</p>
            <p class="mt-2 text-sm leading-6 text-[#536c72]">
              Visit the FAQs for accurate information about what is and is not
              connected yet.
            </p>
            <RouterLink
              :to="{ name: ROUTE_NAMES.faq }"
              class="mt-3 inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-[#087f6b] underline decoration-[#9dcfc1] underline-offset-4 transition-colors hover:text-[#066c5c] focus-visible:rounded-sm"
            >
              Browse FAQs
              <ArrowRight :size="16" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>

        <form
          class="flex flex-col gap-6 rounded-[1.25rem] bg-white p-5 shadow-[0_12px_42px_-32px_rgba(16,47,59,0.35)] ring-1 ring-[#dce9e7] sm:p-8 lg:p-10"
          novalidate
          @submit.prevent="onSubmit"
          @input="submissionStatus = ''"
        >
          <div class="border-b border-[#dce9e7] pb-5">
            <p
              class="text-xs font-bold uppercase tracking-[0.16em] text-[#087f6b]"
            >
              Your message
            </p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight">
              Prepare a note
            </h2>
            <p class="mt-2 text-sm leading-6 text-[#536c72]">
              We’ll check that each required field is complete.
            </p>
          </div>

          <BaseInput
            id="contact-name"
            v-model="form.name"
            label="Your name"
            autocomplete="name"
            :errors="v$.name.$errors"
            @blur="v$.name.$touch()"
          />
          <BaseInput
            id="contact-email"
            v-model="form.email"
            label="Email address"
            type="email"
            autocomplete="email"
            :errors="v$.email.$errors"
            @blur="v$.email.$touch()"
          />
          <div class="w-full">
            <label for="contact-message" class="mb-1 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="contact-message"
              v-model="form.message"
              rows="6"
              aria-describedby="contact-message-hint"
              :aria-invalid="v$.message.$error"
              :class="[
                'w-full rounded-lg border bg-white p-3 text-sm text-[#102f3b] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f6b]',
                v$.message.$error
                  ? 'border-red-500'
                  : 'border-[#dce9e7] hover:border-[#087f6b]',
              ]"
              @blur="v$.message.$touch()"
            />
            <p id="contact-message-hint" class="mt-1 text-sm text-[#536c72]">
              Please write at least 10 characters.
            </p>
            <p
              v-if="v$.message.$error"
              class="mt-1 text-sm text-red-700"
              role="alert"
            >
              {{ v$.message.$errors[0]?.$message }}
            </p>
          </div>

          <p
            v-if="submissionStatus"
            class="border-l-2 border-[#087f6b] bg-[#f2f8f7] p-4 text-sm leading-6 text-[#102f3b]"
            role="status"
          >
            {{ submissionStatus }}
          </p>
          <BaseButton type="submit" block class="min-h-12 rounded-lg">
            Review message
          </BaseButton>
          <p class="text-center text-xs leading-5 text-[#536c72]">
            Reviewing the form does not send or save your message.
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import { ArrowRight } from "@lucide/vue";
import { RouterLink } from "vue-router";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const form = reactive({ name: "", email: "", message: "" });
const rules = {
  name: {
    required: helpers.withMessage("Please enter your name.", required),
  },
  email: {
    required: helpers.withMessage("Please enter your email address.", required),
    email: helpers.withMessage("Enter a valid email address.", email),
  },
  message: {
    required: helpers.withMessage("Please enter a message.", required),
    minLength: helpers.withMessage(
      "Please write at least 10 characters.",
      minLength(10),
    ),
  },
};

const v$ = useVuelidate(rules, form);
const submissionStatus = ref("");

const onSubmit = async () => {
  submissionStatus.value = "";
  if (!(await v$.value.$validate())) return;

  submissionStatus.value =
    "Your message passes the form checks, but message submission is not connected. Nothing was sent or stored.";
};
</script>
