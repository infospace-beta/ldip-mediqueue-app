import { describe, it, expect } from "vitest";
import { truncate, formatDate } from "@/utils/format";

describe("truncate", () => {
  it("leaves short text alone", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("cuts long text and appends a suffix", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcde...");
  });

  it("handles missing values", () => {
    expect(truncate(undefined)).toBe("");
  });
});

describe("formatDate", () => {
  it("formats an ISO string", () => {
    /**The month abbreviation is locale-data dependent ("Sep" or "Sept"), so
     * assert the shape rather than one runtime's exact string */
    expect(formatDate("2026-09-08")).toMatch(/^8 Sept?\.? 2026$/);
  });

  it("returns an empty string for junk", () => {
    expect(formatDate("not-a-date")).toBe("");
    expect(formatDate(null)).toBe("");
  });
});
