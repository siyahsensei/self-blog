import Link from 'next/link';
import { format } from 'date-fns';
import styles from './PostCard.module.css';

interface PostCardProps {
    post: {
        id: string;
        title: string;
        slug: string;
        content: string; 
        tags: string[];
        createdAt: Date | string;
    };
}

export default function PostCard({ post }: PostCardProps) {
    const date = new Date(post.createdAt);

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                {post.tags.length > 0 && (
                    <span className={styles.tags}>{post.tags[0]}</span>
                )}
                <Link href={`/posts/${post.slug}`} className={styles.titleLink}>
                    <h2 className={styles.title}>{post.title}</h2>
                </Link>
            </header>

            <p className={styles.excerpt}>
                {post.content.slice(0, 200).replace(/[#*`]/g, '')}...
            </p>

            <footer className={styles.meta}>
                <span>{format(new Date(post.createdAt), 'dd MMMM yyyy')}</span>
            </footer>
        </article>
    );
}
