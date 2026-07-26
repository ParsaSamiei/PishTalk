import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    // 'unsafe-inline' on script/style is a pragmatic baseline for Next.js's
    // hydration payload and Tailwind/styled-jsx inline styles without
    // wiring up nonce-based CSP in middleware; frame-ancestors/object-src/
    // base-uri/form-action are the parts doing the real work here, capping
    // the blast radius of any XSS that does slip through (e.g. via the two
    // dangerouslySetInnerHTML sinks for blog content and the maps embed).
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    // Media (event covers, gallery, blog covers, logo/favicon/OG image) is
    // uploaded through the admin panel by URL from any host, so remote
    // images are optimized from any https source.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
