import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get('tag');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tag) {
        where.tags = { has: tag };
    }
    if (status) {
        where.status = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
    }

    try {
        const [posts, total] = await prisma.$transaction([
            prisma.post.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.post.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            posts,
            metadata: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, content, tags, status, slug } = body;



        const finalSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const post = await prisma.post.create({
            data: {
                title,
                content,
                tags,
                status,
                slug: finalSlug,
            },
        });
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
