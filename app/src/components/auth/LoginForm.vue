<template>
  <BaseCard class="w-full max-w-md">
    <template #header>
      <div>
        <h1 class="text-lg font-semibold">Sign in</h1>
        <p class="muted text-sm">Use your account to continue</p>
      </div>
    </template>

    <form class="flex flex-col gap-5" @submit.prevent="onSubmit">
      <BaseInput
        id="login-email"
        v-model="formData.email"
        label="Email"
        type="email"
        :errors="v$.email.$errors"
      />
      <BaseInput
        id="login-password"
        v-model="formData.password"
        label="Password"
        type="password"
        :errors="v$.password.$errors"
      />

      <p v-if="auth.error" class="text-sm text-red-600" role="alert">
        {{ auth.error }}
      </p>

      <BaseButton type="submit" block :loading="auth.isLoading">
        Sign in
      </BaseButton>
    </form>

    <template #footer>
      <p class="muted text-xs">
        Demo credentials: <code>test@gmail.com</code> / <code>test</code>
      </p>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useAuthStore } from "@/stores";
import { ROUTE_NAMES } from "@/constants/routeNames";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const formData = reactive({
  email: "",
  password: "",
});

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(3) },
};

const v$ = useVuelidate(rules, formData);

onMounted(() => {
  /**Clear any error left over from a previous attempt */
  auth.error = null;
});

/**Validate, log in, then continue to wherever the guard came from */
const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const loggedIn = await auth.login(formData);
  if (!loggedIn) return;

  const target = route.query.returnUrl || auth.returnUrl;
  auth.returnUrl = null;
  router.push(target ? String(target) : { name: ROUTE_NAMES.home });
};
</script>
