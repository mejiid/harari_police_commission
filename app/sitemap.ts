import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";

const BASE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;

  // Static pages
  const staticPages = ["", "/news", "/reports", "/about", "/contact"];
  const staticRoutes = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  // Dynamic article pages
  const articles = await db.article.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const articleRoutes = locales.flatMap((locale) =>
    articles.map((article) => ({
      url: `${BASE_URL}/${locale}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...articleRoutes];
}
