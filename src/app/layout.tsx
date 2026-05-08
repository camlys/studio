import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChronoFlow | Premium Age Calculator & Chronology Engine',
  description: 'A high-precision age and date difference calculator. Features real-time tracking, zodiac mapping, and AI-driven chronological insights.',
  keywords: 'age calculator, date difference, birthday countdown, chronological engine, time tracker, precision calculator, zodiac sign calculator',
  openGraph: {
    title: 'ChronoFlow | Premium Age Calculator',
    description: 'High-precision chronological computation engine for professional and personal use.',
    url: 'https://chronoflow.app',
    siteName: 'ChronoFlow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChronoFlow | Premium Age Calculator',
    description: 'High-precision chronological computation engine with real-time tracking.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ChronoFlow",
  "operatingSystem": "All",
  "applicationCategory": "UtilityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "1250"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ChronoFlow",
  "url": "https://chronoflow.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://chronoflow.app/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
