import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxiosError } from "axios";
import { useContactForm } from "@/composables/useContactForm";
import { contactService } from "@/services/contact.service";
import type { ContactMessage } from "@/types/models";

vi.mock("@/services/contact.service", () => ({
  contactService: { send: vi.fn() },
}));

const fill = (form: ContactMessage) => {
  form.name = "Ada";
  form.email = "ada@example.com";
  form.message = "I would like to know more about this template.";
};

describe("useContactForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not call the API while the form is invalid", async () => {
    const { form, submit } = useContactForm();
    form.name = "A";
    form.email = "not-an-email";
    form.message = "short";

    expect(await submit()).toBe(false);
    expect(contactService.send).not.toHaveBeenCalled();
  });

  it("sends valid input and clears the form", async () => {
    vi.mocked(contactService.send).mockResolvedValue({
      data: { id: 1, name: "Ada", email: "ada@example.com", message: "..." },
    } as Awaited<ReturnType<typeof contactService.send>>);
    const { form, submit, isSent } = useContactForm();
    fill(form);

    expect(await submit()).toBe(true);
    expect(contactService.send).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      message: "I would like to know more about this template.",
    });
    expect(isSent.value).toBe(true);
    expect(form.name).toBe("");
  });

  it("surfaces per-field errors from a 422", async () => {
    vi.mocked(contactService.send).mockRejectedValue(
      new AxiosError("Unprocessable", "422", undefined, null, {
        status: 422,
        data: {
          message: "Please check the highlighted fields.",
          errors: { email: ["That domain is blocked."] },
        },
      } as never),
    );
    const { form, submit, fieldErrors, error } = useContactForm();
    fill(form);

    expect(await submit()).toBe(false);
    expect(fieldErrors.value.email).toEqual(["That domain is blocked."]);
    expect(error.value).toBe("Please check the highlighted fields.");
  });

  it("falls back to a single message for other failures", async () => {
    vi.mocked(contactService.send).mockRejectedValue(
      new AxiosError("Server error", "500", undefined, null, {
        status: 500,
        data: {},
      } as never),
    );
    const { form, submit, error, fieldErrors } = useContactForm();
    fill(form);

    expect(await submit()).toBe(false);
    expect(error.value).toBe("We could not send that. Please try again.");
    expect(fieldErrors.value).toEqual({});
  });
});
