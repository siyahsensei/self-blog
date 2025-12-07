import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { deletePost } from './actions';
import Pagination from '@/components/Pagination';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const limit = 20;
    const skip = (currentPage - 1) * limit;

    const [posts, total] = await prisma.$transaction([
        prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.post.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/kara/pages/about" className={styles.createBtn} style={{ background: 'var(--secondary)' }}>
                        Edit About
                    </Link>
                    <Link href="/kara/new" className={styles.createBtn}>
                        + New Post
                    </Link>
                </div>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td>
                                    <Link href={`/kara/edit/${post.id}`} className={styles.postTitle}>
                                        {post.title}
                                    </Link>
                                </td>
                                <td>
                                    <span className={post.status === 'PUBLISHED' ? styles.published : styles.draft}>
                                        {post.status}
                                    </span>
                                </td>
                                <td>{format(new Date(post.createdAt), 'MMM d, yyyy')}</td>
                                <td>
                                    <form action={deletePost.bind(null, post.id)}>
                                        <button type="submit" className={styles.deleteBtn}>Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/kara?"
            />
        </div>
    );
}
