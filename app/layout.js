import "../styles/base.css";
import "../styles/layout.css";
import "../styles/components.css";
import { site } from "../lib/site";
import { Analytics } from "@vercel/analytics/next";
import {
  Atkinson_Hyperlegible_Mono,
  Atkinson_Hyperlegible_Next,
} from "next/font/google";

// Atkinson Hyperlegible was drawn by the Braille Institute for low-vision
// readers, which is who this app is for. next/font self-hosts both files at
// build time, so the page still makes no request to Google.
const sans = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-atkinson",
});

// The mono cut sets the 001, 002, 003 numbering: the numbers are the product.
const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-atkinson-mono",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "WIB - Mezclador de Música · mezcla tus canciones para el USB",
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [
    { name: "Pablo Nieto Pérez", url: "https://www.fiverr.com/pablonietop" },
  ],
  creator: "Pablo Nieto Pérez — wib.digital",
  publisher: "wib.digital",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    title: "WIB - Mezclador de Música · mezcla tus canciones para el USB",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.themeColor,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pablo Nieto Pérez",
  url: "https://wib.digital",
  jobTitle: "Web Designer and Developer",
  sameAs: [
    "https://www.fiverr.com/pablonietop",
    "https://www.linkedin.com/in/pablo-nieto-perez-39a530292",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
