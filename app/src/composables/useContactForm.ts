import { computed, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { contactService } from "@/services/contact.service";
import { apiFieldErrors, apiMessage, isValidationError } from "@/utils/errors";
import type { ContactMessage } from "@/types/models";

/**
 * Contact form state: the fields, their rules, and what happens on submit.
 *
 * Kept out of the component so the view stays markup and the rules can be
 * tested on their own.
 */
export function useContactForm() {
  const form = reactive<ContactMessage>({
    name: "",
    email: "",
    message: "",
  });

  const isSending = ref(false);
  const isSent = ref(false);
  const error = ref<string | null>(null);
  /**Per-field messages the API sent back, keyed by field name */
  const fieldErrors = ref<Record<string, string[]>>({});

  const rules = computed(() => ({
    name: { required, minLength: minLength(2) },
    email: { required, email },
    message: {
      required,
      minLength: helpers.withMessage(
        "Tell us a little more - at least 10 characters.",
        minLength(10),
      ),
    },
  }));

  const v$ = useVuelidate(rules, form);

  function reset(): void {
    form.name = "";
    form.email = "";
    form.message = "";
    v$.value.$reset();
  }

  async function submit(): Promise<boolean> {
    const isValid = await v$.value.$validate();
    if (!isValid) return false;

    isSending.value = true;
    error.value = null;
    fieldErrors.value = {};

    try {
      await contactService.send({ ...form });
      isSent.value = true;
      reset();
      return true;
    } catch (err) {
      /**A 422 carries per-field messages; anything else is a single banner */
      if (isValidationError(err)) {
        fieldErrors.value = apiFieldErrors(err);
      }
      error.value = apiMessage(
        err,
        "We could not send that. Please try again.",
      );
      return false;
    } finally {
      isSending.value = false;
    }
  }

  return { form, v$, isSending, isSent, error, fieldErrors, submit, reset };
}
