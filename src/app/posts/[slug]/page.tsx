import { prisma } from '@/lib/prisma';
import MarkdownView from '@/components/MarkdownView';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import styles from './page.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';

interface PostProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const ogImage = post.featuredImage || '/default-og.png';

    return {
        title: post.title,
        description: post.content.substring(0, 160).replace(/[#*`]/g, '') + '...',
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 160).replace(/[#*`]/g, '') + '...',
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: ['Siyah Sensei'],
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
    };
}

export default async function PostPage({ params }: PostProps) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
    });

    if (!post || post.status !== 'PUBLISHED') {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: post.title,
        image: post.featuredImage ? [post.featuredImage] : [],
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: {
            '@type': 'Person',
            name: 'Siyah Sensei',
            url: 'https://blog.siyahsensei.com/about'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Siyah Sensei Blog',
            logo: {
                '@type': 'ImageObject',
                url: 'https://blog.siyahsensei.com/logo.png'
            }
        },
        description: post.content.substring(0, 160).replace(/[#*`]/g, '') + '...',
    };

    return (
        <article className={styles.article}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className={styles.header}>
                <div className={styles.meta}>
                    <time>{format(new Date(post.createdAt), 'dd MMMM yyyy')}</time>
                    <span className={styles.separator}>/</span>
                    <span className={styles.tags}>{post.tags.join(', ')}</span>
                </div>
                <h1 className={styles.title}>{post.title}</h1>
            </header>

            <div className={`container-text ${styles.content}`}>
                <MarkdownView content={post.content} />
            </div>

            <div className={`container-text ${styles.footer}`}>
                <div className={styles.divider} />
                <div className={styles.author}>
                    <h3>About the author</h3>
                    <p>Thoughts, stories and ideas.</p>
                </div>
            </div>
        </article>
    );
}
