import api from "@/services/http/client";
import type { ContactMessage, ContactReceipt } from "@/types/models";

/**
 * Contact endpoint. Answered by the fake backend in local mode, which also
 * demonstrates a 422 with per-field errors (try an @spam.test address).
 */
export const contactService = {
  send: (message: ContactMessage) =>
    api.post<ContactReceipt, ContactMessage>("/contact", message),
};
