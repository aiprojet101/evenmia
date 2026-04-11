import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { config } from "@/lib/config";
import WhatsAppButton from "@/components/WhatsAppButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = `${config.brand} — Organisatrice d'evenements | ${config.region}`;
const description = `Organisation d'evenements sur-mesure : mariages, fiancailles, anniversaires, baptemes, seminaires. Devis en ligne gratuit. ${config.city} et ${config.region}.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    `organisatrice evenements ${config.city}`,
    `wedding planner ${config.region}`,
    `organisation mariage ${config.department}`,
    `decoration evenement`,
    `devis evenementiel en ligne`,
    ...config.zones.map(z => `evenements ${z}`),
  ],
  openGraph: {
    title,
    description,
    locale: "fr_FR",
    type: "website",
    siteName: config.brand,
    url: `https://${config.domain}`,
  },
  alternates: {
    canonical: `https://${config.domain}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.brand,
    description,
    url: `https://${config.domain}`,
    telephone: config.phoneIntl,
    email: config.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: config.city,
      postalCode: config.postalCode,
      addressRegion: config.department,
      addressCountry: "FR",
    },
    areaServed: config.zones.map(z => ({ "@type": "City", name: z })),
    priceRange: "€€-€€€",
  };

  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
        {/* Google Maps desactive temporairement - a reactiver quand billing active */}
        {false && process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
