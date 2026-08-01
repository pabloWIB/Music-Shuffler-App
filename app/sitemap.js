import { site } from "../lib/site";

/** Served at /sitemap.xml. The app is a single public page. */
export default function sitemap() {
  return [
    {
      url: site.url,
      lastModified: new Date("2026-07-31"),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}
