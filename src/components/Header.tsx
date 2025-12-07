import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`container-wide ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    root@techblog:~#
                </Link>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/about" className={styles.link}>About</Link>

                </nav>
            </div>
        </header>
    );
}
