import api from "@/services/http/client";
import type {
  AdminContactMessage,
  ContactMessage,
  ContactReceipt,
} from "@/types/models";

export type ContactMessageStatus = "READ" | "RESOLVED";

export const contactService = {
  send: (message: ContactMessage) =>
    api.post<ContactReceipt, ContactMessage>("/contact", message),

  getAll: () =>
    api.get<AdminContactMessage[]>("/contact"),

  updateStatus: (id: number, status: ContactMessageStatus) =>
    api.patch<AdminContactMessage, { status: ContactMessageStatus }>(
      `/contact/${id}/status`,
      { status },
    ),
};
