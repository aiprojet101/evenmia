import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { config } from "@/lib/config";
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
