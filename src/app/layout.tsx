import type {Metadata, Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#00b4d8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://calculator.camly.org'),
  title: {
    default: 'ChronoFlow | Premium Age Calculator & Chronology Engine',
    template: '%s | ChronoFlow'
  },
  description: 'A high-precision age and date difference calculator. Features real-time tracking, zodiac mapping, and AI-driven chronological insights.',
  keywords: ['age calculator', 'date difference', 'birthday countdown', 'chronological engine', 'time tracker', 'precision calculator', 'zodiac sign calculator', 'due date engine', 'pregnancy calculator'],
  authors: [{ name: 'Camly Operations Team' }],
  creator: 'Camly Inc',
  publisher: 'Camly Inc',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ChronoFlow',
  },
  openGraph: {
    title: 'ChronoFlow | Premium Age Calculator',
    description: 'High-precision chronological computation engine for professional and tactical use.',
    url: 'https://calculator.camly.org',
    siteName: 'ChronoFlow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChronoFlow | Premium Age Calculator',
    description: 'High-precision chronological computation engine with real-time tracking.',
    creator: '@chronoflow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Camly Inc",
  "url": "https://camly.org",
  "logo": "https://calculator.camly.org/logo.png",
  "sameAs": [
    "https://twitter.com/camly",
    "https://github.com/camly"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ChronoFlow",
  "url": "https://calculator.camly.org",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://calculator.camly.org/blog?q={search_term_string}",
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
