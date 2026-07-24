import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

const STATIC_ROUTES = [
  "",
  "/events",
  "/blog",
  "/resources",
  "/gallery",
  "/rules",
  "/faq",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  try {
    const [events, blogs] = await Promise.all([
      prisma.event.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blog.findMany({
        where: { published: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${SITE_URL}/events/${event.slug}`,
      lastModified: event.updatedAt,
    }));

    const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
    }));

    return [...staticEntries, ...eventEntries, ...blogEntries];
  } catch {
    return staticEntries;
  }
}
