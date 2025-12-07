import { prisma } from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import Pagination from '@/components/Pagination';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { tag, page } = await searchParams;
  const currentPage = parseInt(page || '1');
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const where: any = {
    status: 'PUBLISHED',
  };

  if (tag) {
    where.tags = {
      has: tag,
    };
  }

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const baseUrl = tag ? `/?tag=${tag}&` : '/?';

  
  const allPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { tags: true },
  });

  const tags = Array.from(new Set(allPosts.flatMap(p => p.tags))).sort();

  return (
    <div className={styles.wrapper}>
      {}
      <section className={styles.hero}>
        <div className="container-wide">
          <h1 className={styles.blogTitle}>Attila Clone</h1>
          <p className={styles.blogDescription}>Thoughts, stories and ideas.</p>
        </div>
      </section>

      <main className={`container-wide ${styles.main}`}>
        <div className={styles.contentWrapper}>
          <div className={styles.feedColumn}>
            <div className={styles.feed}>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <p className={styles.empty}>No posts found.</p>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={baseUrl}
            />
          </div>

          <div className={styles.sidebarColumn}>
            <Sidebar tags={tags} activeTag={tag} />
          </div>
        </div>
      </main>
    </div>
  );
}
