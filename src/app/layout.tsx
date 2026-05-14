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
    default: 'Camly | Premium High-Precision Calculators & Chronology Engines',
    template: '%s | Camly Professional'
  },
  description: 'Access a suite of high-precision computational engines. Features clinical due date tracking, fiscal EMI inference, academic CGPA sync, and metabolic energy profiling.',
  keywords: ['age calculator', 'date difference', 'scientific calculator', 'due date engine', 'EMI calculator', 'CGPA calculator', 'BMI sync', 'calorie tracker', 'attendance meter', 'precision logic'],
  authors: [{ name: 'Camly Operations Team' }],
  creator: 'Camly Inc',
  publisher: 'Camly Inc',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/camly.png' },
      { url: '/camly.png', sizes: '192x192', type: 'image/png' },
      { url: '/camly.png', sizes: '384x384', type: 'image/png' },
      { url: '/camly.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/camly.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Camly',
  },
  openGraph: {
    title: 'Camly | Premium Computational Engines',
    description: 'High-precision computational planning suite for professional and tactical management.',
    url: 'https://calculator.camly.org',
    siteName: 'Camly',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Camly | Premium Calculators',
    description: 'Mission-critical chronological and mathematical engines with real-time tracking.',
    creator: '@camly',
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
  "name": "Camly",
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
