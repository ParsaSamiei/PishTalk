const PERSIAN_DATE_FORMATTER = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const PERSIAN_WEEKDAY_FORMATTER = new Intl.DateTimeFormat("fa-IR", {
  weekday: "long",
});

/**
 * Formats a date using the Persian (Jalali) calendar, e.g. "۱۴ خرداد ۱۴۰۴".
 */
export function formatEventDate(date: Date): string {
  return PERSIAN_DATE_FORMATTER.format(date);
}

/**
 * Returns the Persian weekday name, e.g. "چهارشنبه".
 */
export function formatWeekday(date: Date): string {
  return PERSIAN_WEEKDAY_FORMATTER.format(date);
}
