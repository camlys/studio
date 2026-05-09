import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChronoFlow | High-Precision Chronological Engine',
    short_name: 'ChronoFlow',
    description: 'Professional high-precision age calculator, scientific ALU, and clinical due date engine.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00b4d8',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
