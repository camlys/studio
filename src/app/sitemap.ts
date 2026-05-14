import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculator.camly.org';
  
  const blogPosts = [
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
    '/blog',
    '/privacy-protocol',
    '/terms-of-sync',
    '/security-ops'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const blogRoutes = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes];
}
