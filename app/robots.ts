import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Funnel steps hold no indexable content on their own.
      disallow: ["/rank/portfolio", "/rank/leverage", "/rank/reveal"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
