import { describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import JoinQueueForm from "@/components/JoinQueueForm.vue";

describe("JoinQueueForm", () => {
  it("validates details without claiming to submit or reserve a queue place", async () => {
    const wrapper = mount(JoinQueueForm);

    await wrapper.get("form").trigger("submit");
    expect(wrapper.get('[role="alert"]').text()).toContain(
      "Enter a hospital and select a department, service, and visit type.",
    );
    expect(wrapper.find('[role="status"]').exists()).toBe(false);

    await wrapper.get("#hospital-search").setValue("Example clinic");
    const selects = wrapper.findAll("select");
    await selects[0]?.setValue("General practice");
    await flushPromises();
    await selects[1]?.setValue("Consultation");
    await selects[2]?.setValue("Walk-in");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.get('[role="status"]').text()).toContain(
      "No queue request was sent or saved",
    );
    expect(wrapper.get('[role="status"]').text()).toContain(
      "no place in line was reserved",
    );
    expect(wrapper.get('button[type="submit"]').text()).toContain(
      "Check details",
    );
  });
});
