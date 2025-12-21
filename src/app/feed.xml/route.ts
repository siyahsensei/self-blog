import { prisma } from '@/lib/prisma';
import { Feed } from 'feed';

export const dynamic = 'force-dynamic';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.siyahsensei.com';

    const feed = new Feed({
        title: 'Siyah Sensei Blog',
        description: 'Technical tutorials on Software Engineering, Next.js, and Systems Architecture.',
        id: baseUrl,
        link: baseUrl,
        language: 'en',
        image: `${baseUrl}/logo.png`,
        favicon: `${baseUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, Siyah Sensei`,
        updated: new Date(),
        generator: 'Next.js Feed Generator',
        feedLinks: {
            rss2: `${baseUrl}/feed.xml`,
            json: `${baseUrl}/feed.json`,
            atom: `${baseUrl}/atom.xml`,
        },
        author: {
            name: 'Siyah Sensei',
            link: baseUrl,
        },
    });

    const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            featuredImage: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    posts.forEach((post) => {
        const postUrl = `${baseUrl}/posts/${post.slug}`;
        const description = post.content
            .replace(/[#*`]/g, '')
            .split('\n\n')[0]
            .substring(0, 200) + '...';

        feed.addItem({
            title: post.title,
            id: post.id,
            link: postUrl,
            description: description,
            content: post.content,
            author: [
                {
                    name: 'Siyah Sensei',
                    link: baseUrl,
                },
            ],
            date: post.createdAt,
            published: post.createdAt,
            image: post.featuredImage || undefined,
            category: post.tags.map(tag => ({ name: tag })),
        });
    });

    return new Response(feed.rss2(), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
}
