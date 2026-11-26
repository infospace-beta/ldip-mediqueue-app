import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync("src/assets/styles/patient-portal.css", "utf8");
const themeStylesheet = readFileSync("src/assets/styles/tailwind.css", "utf8");

function rule(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return stylesheet.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))?.[1];
}

describe("patient portal styles", () => {
  it("uses a two-column form grid with full-width controls and mobile stacking", () => {
    expect(rule(".app-shell .patient-form-grid")).toMatch(/display:\s*grid/);
    expect(rule(".app-shell .patient-form-grid")).toMatch(
      /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
    );
    expect(
      rule(".app-shell .patient-form-field > :is(input, select, textarea)"),
    ).toMatch(/width:\s*100%/);

    const mobileStyles =
      stylesheet.split("@media (max-width: 680px)")[1] ?? "";
    expect(mobileStyles).toContain(
      ".app-shell .patient-form-grid {\n    grid-template-columns: minmax(0, 1fr);",
    );
  });

  it("uses theme-aware divider tokens and includes an intentional image fallback", () => {
    expect(stylesheet.match(/border-(?:top|bottom):[^;]*#[0-9a-f]{3,8}/gi)).toBeNull();
    expect(rule(".dashboard-welcome-fallback")).toContain(
      "var(--app-surface-muted)",
    );
    const borderTokens =
      themeStylesheet.match(/--app-border:\s*([^;]+);/g) ?? [];
    expect(borderTokens).toHaveLength(2);
    expect(new Set(borderTokens).size).toBe(2);
  });
});
