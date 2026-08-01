import "../styles/base.css";
import "../styles/layout.css";
import "../styles/components.css";
import { site } from "../lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Mezclador de Música — mezcla tus canciones para el USB",
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
    title: "Mezclador de Música — mezcla tus canciones para el USB",
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
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
