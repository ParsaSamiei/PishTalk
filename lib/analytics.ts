/**
 * Thin wrapper around the Umami tracker's global `window.umami` object.
 *
 * Safe to call unconditionally from client components: if the tracker
 * script hasn't loaded (local dev, ad blocker, self-hosted instance down)
 * `window.umami` is simply undefined and this becomes a no-op instead of
 * throwing.
 */
declare global {
  interface Window {
    umami?: {
      track: (
        eventName: string,
        data?: Record<string, string | number | boolean>
      ) => void;
    };
  }
}

export function trackEvent(
  eventName: string,
  data?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  window.umami?.track(eventName, data);
}
