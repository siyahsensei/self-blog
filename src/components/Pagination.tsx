import Link from 'next/link';
import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string; 
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className={styles.pagination}>
            {prevPage ? (
                <Link href={`${baseUrl}page=${prevPage}`} className={styles.link}>
                    &lt; Prev
                </Link>
            ) : (
                <span className={styles.disabled}>&lt; Prev</span>
            )}

            <div className={styles.pages}>
                {pages.map((p) => {
                    
                    if (
                        p === 1 ||
                        p === totalPages ||
                        (p >= currentPage - 1 && p <= currentPage + 1)
                    ) {
                        return (
                            <Link
                                key={p}
                                href={`${baseUrl}page=${p}`}
                                className={`${styles.pageLink} ${p === currentPage ? styles.active : ''}`}
                            >
                                {p}
                            </Link>
                        );
                    } else if (
                        p === currentPage - 2 ||
                        p === currentPage + 2
                    ) {
                        return <span key={p} className={styles.dots}>...</span>
                    }
                    return null;
                })}
            </div>

            {nextPage ? (
                <Link href={`${baseUrl}page=${nextPage}`} className={styles.link}>
                    Next &gt;
                </Link>
            ) : (
                <span className={styles.disabled}>Next &gt;</span>
            )}
        </nav>
    );
}
