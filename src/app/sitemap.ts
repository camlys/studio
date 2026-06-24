import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculator.camly.org';
  
  const blogPosts = [
    'physics-of-digital-precision-masterclass',
    'computational-resource-allocation-masterclass',
    'arithmetic-logic-unit-optimization',
    'science-of-temporal-drift',
    'ultimate-emi-seo-masterclass',
    'seo-due-date-calculator-masterclass',
    'ultimate-bmi-seo-masterclass',
    'seo-age-calculator-masterclass',
    'ultimate-seo-precision-masterclass',
    'tactical-project-chronology-masterclass',
    'academic-attendance-logic-masterclass',
    'cognitive-focus-velocity-masterclass',
    'ultimate-fiscal-emi-masterclass',
    'ultimate-metabolic-calorie-masterclass',
    'definitive-cgpa-masterclass',
    'biometric-precision-masterclass',
    'ultimate-pregnancy-due-date-masterclass',
    'ultimate-age-calculator-masterclass',
    'digital-asset-velocity-enterprise-guide',
    'global-time-synchronization-standards',
    'image-and-pdf-resizing-optimization',
    'ai-revolution-personal-utilities',
    'zodiac-symbols-history-of-time',
    'ultimate-guide-to-age-calculation'
  ];

  const routes = [
    '',
    '/calculator',
    '/due-date-calculator',
    '/cgpa-calculator',
    '/emi-calculator',
    '/attendance-calculator',
    '/calorie-calculator',
    '/bmi-calculator',
    '/blog',
    '/privacy-protocol',
    '/terms-of-sync',
    '/security-ops',
    '/focus'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.85,
  }));

  const blogRoutes = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...routes, ...blogRoutes];
}
