import { prisma } from '@/lib/prisma';
import PageEditor from './PageEditor';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function EditPage({ params }: PageProps) {
    const { slug } = await params;
    const page = await prisma.page.findUnique({
        where: { slug },
    });

    if (!page) {
        notFound();
    }

    return (
        <div style={{ padding: '0' }}>
            <h1 style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>Edit Page: {page.title}</h1>
            <PageEditor page={page} />
        </div>
    );
}
