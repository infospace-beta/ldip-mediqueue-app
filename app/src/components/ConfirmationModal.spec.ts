import { afterEach, describe, expect, it } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

describe("ConfirmationModal", () => {
  let wrapper: VueWrapper | undefined;
  let trigger: HTMLButtonElement | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    trigger?.remove();
    trigger = undefined;
  });

  it("labels destructive actions and manages keyboard focus", async () => {
    trigger = document.createElement("button");
    trigger.textContent = "Clear request";
    document.body.append(trigger);
    trigger.focus();

    wrapper = mount(ConfirmationModal, {
      attachTo: document.body,
      props: {
        open: true,
        title: "Clear this queue request?",
        message: "This only clears local session details.",
        confirmLabel: "Clear request",
        cancelLabel: "Keep request",
        destructive: true,
      },
    });
    await nextTick();

    const dialog = document.body.querySelector('[role="alertdialog"]');
    const buttons = dialog?.querySelectorAll("button");
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog?.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.activeElement).toBe(buttons?.item(0));

    buttons?.item(1)?.focus();
    buttons
      ?.item(1)
      ?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
      );
    expect(document.activeElement).toBe(buttons?.item(0));

    buttons?.item(0)?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
      }),
    );
    expect(document.activeElement).toBe(buttons?.item(1));

    buttons
      ?.item(1)
      ?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    expect(wrapper.emitted("cancel")).toHaveLength(1);

    await wrapper.setProps({ open: false });
    await nextTick();
    expect(document.activeElement).toBe(trigger);
  });

  it("emits confirmation only when the confirm action is activated", async () => {
    wrapper = mount(ConfirmationModal, {
      attachTo: document.body,
      props: {
        open: true,
        title: "Continue?",
        message: "This is an informational confirmation.",
        confirmLabel: "Continue",
      },
    });
    await nextTick();

    document.body
      .querySelector(".confirmation-dialog button:last-child")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(wrapper.emitted("confirm")).toHaveLength(1);
    expect(wrapper.emitted("cancel")).toBeUndefined();
  });
});
