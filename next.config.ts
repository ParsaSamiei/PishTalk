import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // 'unsafe-eval' is added to script-src ONLY in development: next dev's
    // webpack/HMR runtime relies on eval() to wire up fast refresh, and
    // without it the whole client bundle can fail to execute (this is what
    // was silently killing client-only components like CustomCursor).
    // Production builds don't need it and stay locked down.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
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
  output: "standalone",
  // lib/decodeImage.ts reads @jsquash's .wasm off disk at runtime via
  // require.resolve. Keeping the package external stops the bundler from
  // rewriting that resolution, and the tracing include copies the .wasm into
  // the standalone output — file tracing does not follow a runtime readFile on
  // its own, so without this the webp path throws ENOENT in the container
  // while working perfectly in dev.
  serverExternalPackages: ["@jsquash/webp", "jimp"],
  outputFileTracingIncludes: {
    "/api/admin/upload": ["./node_modules/@jsquash/webp/codec/dec/*.wasm"],
  },
  webpack: (config) => {
    // @jsquash ships .wasm as raw assets to be loaded via readFile and
    // WebAssembly.compile at runtime. Without this, webpack tries to parse
    // them as modules and fails with "WebAssembly is not enabled by default".
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    // Treat .wasm as assets rather than entry points; emit them unchanged so
    // require.resolve finds them where we expect them.
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });
    return config;
  },
  images: {
    // Media (event covers, gallery, blog covers, logo/favicon/OG image) is
    // uploaded through the admin panel via /api/admin/upload and served as a
    // local /uploads/... path. Pasting a full https URL is still accepted as
    // a fallback, so remote images from any host are allowed here too.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
