import { PrismaClient } from '@prisma/client';
import 'dotenv/config';


const prisma = new PrismaClient();

async function main() {
    console.log('Checking database...');

    // Check if database already has data
    const existingPosts = await prisma.post.count();
    const existingPages = await prisma.page.count();

    if (existingPosts > 0 || existingPages > 0) {
        console.log('Database already contains data. Skipping seed.');
        return;
    }

    console.log('Database is empty. Seeding...');

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
            id: '0aabfd20-b3ee-4eca-a322-7eb13f49ad93',
            title: 'About',
            slug: 'about',
            content: `# About Me

Welcome to my **technical blog**! I'm a *passionate developer* who loves building modern web applications and sharing knowledge with the community.

## What I Do

I specialize in full-stack development with a focus on:

- **Frontend**: React, Next.js, TypeScript
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL, Redis
- **DevOps**: Docker, CI/CD, Self-hosting

## My Tech Stack

This blog is built using cutting-edge technologies:

\`\`\`javascript
const techStack = {
  framework: "Next.js 14+",
  language: "TypeScript",
  database: "PostgreSQL",
  orm: "Prisma",
  storage: "MinIO",
  deployment: "Docker"
};
\`\`\`

## Philosophy

> "The best way to learn is to teach others."

I believe in *open source*, **continuous learning**, and ***sharing knowledge*** with the developer community.

## Topics I Write About

1. Web Development
2. Self-hosting Solutions
3. DevOps & Infrastructure
4. Software Architecture
5. Developer Tools & Productivity

## Get In Touch

Feel free to reach out via:

- Email: \`your@email.com\`
- GitHub: [github.com/yourusername](https://github.com)
- Twitter: [@yourusername](https://twitter.com)

---

*Thanks for visiting!* 🚀
`,
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
