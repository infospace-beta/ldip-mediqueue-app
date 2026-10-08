import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseButton from "@/components/ui/BaseButton.vue";

describe("BaseButton", () => {
  it("renders its slot and emits click", async () => {
    const wrapper = mount(BaseButton, { slots: { default: "Save" } });

    expect(wrapper.text()).toContain("Save");
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("is disabled and shows a spinner while loading", () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: "Save" },
    });

    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.find('[role="status"]').exists()).toBe(true);
  });

  it("applies the variant classes", () => {
    const wrapper = mount(BaseButton, { props: { variant: "danger" } });

    expect(wrapper.classes().join(" ")).toContain("bg-red-600");
  });
});
