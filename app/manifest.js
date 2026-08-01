import { site } from "../lib/site";

/** Served at /manifest.webmanifest; Next.js injects the <link rel="manifest">. */
export default function manifest() {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: "es",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: site.themeColor,
    background_color: site.backgroundColor,
    categories: ["music", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
