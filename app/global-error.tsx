"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>مشکلی پیش آمد</h1>
          <p>متاسفانه خطایی در سایت رخ داد. لطفاً دوباره تلاش کنید.</p>
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
            تلاش دوباره
          </button>
        </div>
      </body>
    </html>
  );
}
