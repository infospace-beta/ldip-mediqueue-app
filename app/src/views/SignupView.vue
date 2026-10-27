<template>
  <BaseCard class="auth-form-card w-full">
    <template #header>
      <div class="space-y-1">
        <p class="auth-eyebrow">Patient access</p>
        <h1 class="auth-heading">Create your MediQueue account</h1>
        <p class="auth-supporting">
          Use your details to access MediQueue's patient services.
        </p>
      </div>
    </template>

    <form
      class="flex flex-col gap-5"
      @submit.prevent="onSubmit"
      @input="submissionError = null"
    >
      <BaseInput
        id="signup-name"
        v-model="formData.fullName"
        label="Full name"
        autocomplete="name"
        placeholder="Your full name"
        :errors="v$.fullName.$errors"
      />
      <BaseInput
        id="signup-email"
        v-model="formData.email"
        label="Email address"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :errors="v$.email.$errors"
      />
      <BaseInput
        id="signup-password"
        v-model="formData.password"
        label="Password"
        type="password"
        autocomplete="new-password"
        :show-password-toggle="true"
        hint="Use at least 8 characters."
        :errors="v$.password.$errors"
      />
      <BaseInput
        id="signup-confirm-password"
        v-model="formData.confirmPassword"
        label="Confirm password"
        type="password"
        autocomplete="new-password"
        :show-password-toggle="true"
        :errors="v$.confirmPassword.$errors"
      />

      <p
        v-if="submissionError"
        class="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950"
        role="alert"
      >
        {{ submissionError }}
      </p>

      <BaseButton
        type="submit"
        block
        class="auth-submit"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        Create account
      </BaseButton>

      <p class="text-center text-sm">
        Already have an account?
        <RouterLink :to="{ name: ROUTE_NAMES.login }" class="auth-link">
          Sign in
        </RouterLink>
      </p>
    </form>

    <template #footer>
      <p class="auth-note" role="note">
        Online registration is not available yet. Submitting this form will not
        create an account.
      </p>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { reactive, ref, toRef } from "vue";
import { RouterLink } from "vue-router";
import useVuelidate from "@vuelidate/core";
import {
  email,
  helpers,
  minLength,
  required,
  sameAs,
} from "@vuelidate/validators";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const formData = reactive({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const rules = {
  fullName: {
    required: helpers.withMessage("Please enter your full name.", required),
  },
  email: {
    required: helpers.withMessage("Please enter your email address.", required),
    email: helpers.withMessage("Enter a valid email address.", email),
  },
  password: {
    required: helpers.withMessage("Please enter a password.", required),
    minLength: helpers.withMessage("Use at least 8 characters.", minLength(8)),
  },
  confirmPassword: {
    required: helpers.withMessage("Please confirm your password.", required),
    sameAsPassword: helpers.withMessage(
      "Passwords do not match.",
      sameAs(toRef(formData, "password")),
    ),
  },
};

const v$ = useVuelidate(rules, formData);
const isSubmitting = ref(false);
const submissionError = ref<string | null>(null);

const onSubmit = async () => {
  if (isSubmitting.value) return;
  submissionError.value = null;
  isSubmitting.value = true;

  try {
    if (!(await v$.value.$validate())) return;

    submissionError.value =
      "Account registration is not connected to a service yet. No account was created.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
