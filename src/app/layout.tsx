import type { Metadata, Viewport } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site, contact } from "@/data/content";
import { palette } from "@/lib/theme";
import "./globals.css";

// Display: high-contrast serif echoing the logo's engraved lettering.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// UI / body: clean geometric grotesk for the futuristic counterpoint.
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const title = "Art Attack Tattoo — Custom Tattoos & Piercing in Winston-Salem, NC";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s · Art Attack Tattoo" },
  description: site.description,
  keywords: ["tattoo", "tattoo shop", "body piercing", "Winston-Salem", "Triad", "custom tattoos", "cover-up tattoos", "North Carolina"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_US",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Art Attack Electric Tattooing logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: palette.ink,
  colorScheme: "dark",
};

/** LocalBusiness structured data, built from the same content file. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: site.legalName,
  url: site.url,
  image: `${site.url}/og.jpg`,
  telephone: "+1-336-924-4658",
  email: contact.email,
  foundingDate: site.founded,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.street,
    addressLocality: contact.city,
    addressRegion: contact.region,
    postalCode: contact.postalCode,
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],
  sameAs: contact.socials.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${grotesk.variable}`}>
      <body className="grain">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <a href="#main" className="sr-only z-[200] rounded bg-bone px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
