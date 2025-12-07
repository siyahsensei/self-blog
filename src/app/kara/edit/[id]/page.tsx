
import { prisma } from '@/lib/prisma';
import PostForm from '../../components/PostForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import styles from '../../new/page.module.css';



export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) {
        notFound();
    }

    return (
        <div>
            <PostForm post={post} />
        </div>
    );
}
