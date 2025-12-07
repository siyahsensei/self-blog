import Link from 'next/link';
import styles from './Sidebar.module.css';

interface SidebarProps {
    tags: string[];
    activeTag?: string;
}

export default function Sidebar({ tags, activeTag }: SidebarProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.title}>Topics</h3>
            <div className={styles.divider} />
            <nav className={styles.nav}>
                <ul className={styles.list}>
                    {tags.map((tag) => (
                        <li key={tag}>
                            <Link
                                href={activeTag === tag ? '/' : `/?tag=${tag}`}
                                className={`${styles.link} ${activeTag === tag ? styles.active : ''}`}
                            >
                                {tag}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
