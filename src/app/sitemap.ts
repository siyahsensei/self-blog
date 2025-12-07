import { prisma } from '@/lib/prisma';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.siyahsensei.com';

    const routes = [
        '',
        '/about',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 1,
    }));


    const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
    });

    const postRoutes = posts.map((post: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...postRoutes];
}
