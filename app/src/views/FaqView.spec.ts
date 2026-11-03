import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import FaqView from "@/views/FaqView.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";

const createRouterForPage = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/faq",
        name: ROUTE_NAMES.faq,
        component: FaqView,
      },
      {
        path: "/contact",
        name: ROUTE_NAMES.contact,
        component: { template: "<div />" },
      },
    ],
  });

describe("FaqView", () => {
  it("exposes an accessible single-open accordion", async () => {
    const router = createRouterForPage();
    await router.push("/faq");
    const wrapper = mount(FaqView, { global: { plugins: [router] } });
    const questions = wrapper.findAll("dt button");

    expect(questions).toHaveLength(5);
    expect(questions[0]?.attributes("aria-expanded")).toBe("false");

    await questions[0]?.trigger("click");
    expect(questions[0]?.attributes("aria-expanded")).toBe("true");
    expect(wrapper.get("#faq-answer-0").attributes("aria-hidden")).toBe(
      "false",
    );

    await questions[1]?.trigger("click");
    expect(questions[0]?.attributes("aria-expanded")).toBe("false");
    expect(questions[1]?.attributes("aria-expanded")).toBe("true");
  });

  it("does not leave an accordion panel open after toggling it closed", async () => {
    const router = createRouterForPage();
    await router.push("/faq");
    const wrapper = mount(FaqView, { global: { plugins: [router] } });
    const firstQuestion = wrapper.get("dt button");

    await firstQuestion.trigger("click");
    await firstQuestion.trigger("click");

    expect(firstQuestion.attributes("aria-expanded")).toBe("false");
    expect(wrapper.get("#faq-answer-0").attributes("aria-hidden")).toBe("true");
  });
});
