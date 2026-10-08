import { unref } from "vue";
import type { ErrorObject } from "@vuelidate/core";

/**
 * Validation messages reach components from two places: Vuelidate's rules
 * (ErrorObject, whose $message may be a ref) and the API's 422 body (plain
 * strings). Components accept either and use these two helpers, so no view has
 * to know the difference.
 */
export type FieldError = ErrorObject | string;

export const fieldErrorMessage = (error: FieldError): string =>
  typeof error === "string" ? error : String(unref(error.$message));

export const fieldErrorKey = (
  error: FieldError,
  index: number,
): string | number =>
  typeof error === "string" ? error : (error.$uid ?? index);
