import { PrismaClient } from '@prisma/client';
import 'dotenv/config';


const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    
    await prisma.post.deleteMany();

    await prisma.post.create({
        data: {
            title: 'Getting Started with Self-Hosting',
            slug: 'getting-started-with-self-hosting',
            content: `
# Why Self-Host?

Self-hosting allows you to take control of your data.

## Requisites
- Linux (Debian/Ubuntu)
- Docker
- Knowledge of CLI

\`\`\`bash
docker run -d -p 80:80 nginx
\`\`\`
      `,
            tags: ['selfhosting', 'linux', 'docker'],
            status: 'PUBLISHED',
        },
    });

    await prisma.post.create({
        data: {
            title: 'My VIM Setup',
            slug: 'my-vim-setup',
            content: `
Simple vimrc:
\`\`\`vim
set number
syntax on
\`\`\`
      `,
            tags: ['vim', 'tools'],
            status: 'PUBLISHED',
        },
    });

    
    await prisma.page.upsert({
        where: { slug: 'about' },
        update: {},
        create: {
            title: 'About Me',
            slug: 'about',
            content: `
# About Me

I am a passionate developer building a technical blog with Next.js and Prisma.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- PostgreSQL
- Prisma
- MinIO

## Contact
Feel free to reach out to me via email or social media.
            `.trim(),
        },
    });

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
