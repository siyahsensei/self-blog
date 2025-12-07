import styles from './TagBar.module.css';
import Link from 'next/link';

interface TagBarProps {
    tags?: string[];
    activeTag?: string;
}

export default function TagBar({ tags = [], activeTag }: TagBarProps) {
    return (
        <div className={styles.wrapper}>
            <div className={`container-wide ${styles.container}`}>
                <div className={styles.scrollArea}>
                    <Link
                        href="/"
                        className={`${styles.tag} ${!activeTag ? styles.active : ''}`}
                    >
                        ALL
                    </Link>
                    {tags.map((tag) => (
                        <Link
                            key={tag}
                            href={`/?tag=${tag}`}
                            className={`${styles.tag} ${activeTag === tag ? styles.active : ''}`}
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
