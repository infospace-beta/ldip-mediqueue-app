/**
 * Pure formatting helpers. Nothing in here may import Vue, a store or a service -
 * that is what keeps them trivially testable.
 */

/**Cut text to `length`, appending an ellipsis only when something was cut */
export const truncate = (
  text: string | null | undefined,
  length = 100,
  suffix = "...",
): string => {
  if (typeof text !== "string") return "";
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}${suffix}`;
};

/**Locale date, e.g. "8 Sep 2026" (exact abbreviation depends on locale data) */
export const formatDate = (
  value: string | number | Date | null | undefined,
  locale = "en-GB",
): string => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
