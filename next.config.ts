import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Media (event covers, gallery, blog covers) is uploaded through the
    // admin panel and stored externally (see docs/05_DATABASE.md "Uploads").
    // Replace this with the exact storage hostname once it is chosen.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
