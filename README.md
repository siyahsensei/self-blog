# Technical Blog Application

A minimalist, developer-focused blog built with Next.js 14+, TypeScript, PostgreSQL, and Prisma.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** CSS Modules (No Tailwind)
- **Markdown:** react-markdown + react-syntax-highlighter
- **Image Upload:** MinIO

## Features
- **Public:**
  - Clean, technical aesthetic.
  - Tag-based filtering.
  - Syntax highlighting for code blocks.
  - Responsive design.
- **Admin:**
  - Secure Dashboard (Basic Auth).
  - Create, Edit, Delete posts.
  - Live Markdown preview.
  - Draft/Published status.
  - Image upload.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   Ensure you have PostgreSQL running. You can use Docker:
   ```bash
   docker run -d --name blog-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:alpine
   ```

3. **Environment Variables**
   Copy the example file:
   ```bash
   cp .env.example .env
   ```
   Update `DATABASE_URL` if needed.
   Set `ADMIN_PASSWORD` (Default: `changeme`).

4. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

## Admin Access
- URL: `/admin`
- User: `admin`
- Password: `changeme` (or value in `.env`)

## Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Ensure `DATABASE_URL` points to your production DB.
