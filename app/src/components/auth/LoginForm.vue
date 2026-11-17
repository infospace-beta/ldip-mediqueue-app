<template>
  <BaseCard class="auth-form-card w-full">
    <template #header>
      <div class="space-y-1">
        <p class="auth-eyebrow">MediQueue access</p>
        <h1 class="auth-heading">Welcome back</h1>
        <p class="auth-supporting">
          Sign in to access your MediQueue workspace.
        </p>
      </div>
    </template>

    <form class="flex flex-col gap-5" @submit.prevent="onSubmit">
      <BaseInput
        id="login-email"
        v-model="formData.email"
        label="Email or username"
        type="text"
        autocomplete="username"
        placeholder="you@example.com or username"
        :errors="v$.email.$errors"
      />
      <BaseInput
        id="login-password"
        v-model="formData.password"
        label="Password"
        type="password"
        autocomplete="current-password"
        :show-password-toggle="true"
        :errors="v$.password.$errors"
      />

      <p
        v-if="auth.error"
        class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        role="alert"
      >
        {{ auth.error }}
      </p>

      <BaseButton
        type="submit"
        block
        class="auth-submit"
        :loading="auth.isLoading"
        :disabled="auth.isLoading"
      >
        Sign in
      </BaseButton>

      <p class="text-center text-sm">
        New to MediQueue?
        <RouterLink :to="{ name: ROUTE_NAMES.signup }" class="auth-link">
          Create an account
        </RouterLink>
      </p>
    </form>

</BaseCard>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useAuthStore } from "@/stores";
import { ROLE_DASHBOARD_NAMES, ROUTE_NAMES } from "@/constants/routeNames";
import { isUserRole } from "@/types/models";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const formData = reactive({
  email: "",
  password: "",
});

const rules = {
  email: { required },
  password: { required, minLength: minLength(3) },
};

const v$ = useVuelidate(rules, formData);

onMounted(() => {
  /**Clear any error left over from a previous attempt */
  auth.error = null;
});

/**Validate, log in, then continue to wherever the guard came from */
const onSubmit = async () => {
  if (auth.isLoading) return;

  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const loggedIn = await auth.login(formData);
  if (!loggedIn) return;

  const requestedTarget = route.query.returnUrl ?? auth.returnUrl;
  const target =
    typeof requestedTarget === "string" &&
    requestedTarget.startsWith("/") &&
    !requestedTarget.startsWith("//") &&
    !requestedTarget.includes("\\") &&
    !Array.from(requestedTarget).some((character) => character.charCodeAt(0) < 32)
      ? requestedTarget
      : null;
  auth.returnUrl = null;
  const role = auth.user?.role;
  router.push(
    target || !isUserRole(role)
      ? (target ?? { name: ROLE_DASHBOARD_NAMES.patient })
      : { name: ROLE_DASHBOARD_NAMES[role] },
  );
};
</script>
