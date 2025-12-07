import { PrismaClient } from '@prisma/client';
import MarkdownView from '@/components/MarkdownView';
import styles from './page.module.css';
import { format } from 'date-fns';



import { prisma } from '@/lib/prisma';

export const revalidate = 60; 

export const metadata = {
    title: 'About | My Tech Blog',
    description: 'Learn more about the developer and the tech stack.',
};

export default async function AboutPage() {
    const page = await prisma.page.findUnique({
        where: { slug: 'about' },
    });

    if (!page) {
        return <div className="container">About page not found.</div>;
    }

    return (
        <article className={styles.aboutArticle}>
            <div className="container-text">
                <MarkdownView content={page.content} />
            </div>
        </article>
    );
}
