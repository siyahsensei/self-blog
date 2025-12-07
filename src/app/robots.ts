import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://siyahsensei.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/kara/', '/api/', '/_next/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
