"use client";

import { useOptionalLocale } from "@/lib/i18n/client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  // This boundary renders its own <html> and sits above LocaleProvider, so
  // the locale context is unavailable here — useOptionalLocale falls back to
  // Persian, which matches the hardcoded lang/dir below.
  const { dictionary: d } = useOptionalLocale();

  return (
    <html lang="fa" dir="rtl">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
            fontFamily: "sans-serif",
            padding: "1rem",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {d.errors.pageTitle}
          </h1>
          <p>{d.errors.globalBody}</p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              background: "#0F172A",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {d.common.tryAgain}
          </button>
        </div>
      </body>
    </html>
  );
}
