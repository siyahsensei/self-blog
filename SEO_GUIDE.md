# SEO Implementation Guide - Siyah Sensei Blog

This guide details the SEO strategy implemented for this Next.js-based technical blog. It covers sitemaps, robots.txt, metadata management, and structured data (Schema.org).

## 1. Sitemap & Robots (`src/app/sitemap.ts` & `src/app/robots.ts`)

These files dynamically generate the `sitemap.xml` and `robots.txt` required by search engines.

### **sitemap.ts**
- **Purpose**: Generates XML sitemap of all public URLs.
- **Logic**:
    - Lists static routes: `/`, `/about` (Monthly frequency).
    - Fetches all `PUBLISHED` posts from Prisma database.
    - Generates post URLs `/posts/[slug]` with `updatedAt` timestamps (Weekly frequency).
- **Location**: `src/app/sitemap.ts` creates `/sitemap.xml`.

### **robots.txt**
- **Purpose**: Instructions for crawler bots.
- **Rules**:
    - `User-agent: *` (All bots).
    - `Allow: /`
    - `Disallow: /kara/` (Admin dashboard)
    - `Disallow: /api/` (API endpoints)
- **Location**: `src/app/robots.ts` creates `/robots.txt`.

---

## 2. Global Metadata (`src/app/layout.tsx`)

The root layout defines the base metadata shared across the site.

- **Base URL**: `metadataBase` set to `process.env.NEXT_PUBLIC_SITE_URL`.
- **Title Template**: `%s | Siyah Sensei Blog` allows pages to set just "Post Title" and have it rendered as "Post Title | Siyah Sensei Blog".
- **Open Graph**: Default OG Type `website`, Locale `en_US`.
- **Robots**: Explicit `index: true, follow: true`.

---

## 3. Dynamic Post SEO (`src/app/posts/[slug]/page.tsx`)

For individual blog posts, we use Next.js `generateMetadata` function.

### **Metadata Fields**
- **Title**: Uses post title.
- **Description**: Truncates post content to 160 chars (removes Markdown symbols).
- **Open Graph**:
    - Type: `article`
    - Image: Uses `featuredImage` from MinIO, falling back to default.
    - Authors: `['Siyah Sensei']`
    - Dates: `publishedTime` (createdAt), `modifiedTime` (updatedAt).

---

## 4. Structured Data (`JSON-LD`)

We inject Schema.org `TechArticle` data into the `<head>` of blog posts to help Google understand the content semantic.

### **Implementation**
In `src/app/posts/[slug]/page.tsx`, a JSON object is constructed and injected via script:

```tsx
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.createdAt.toISOString(),
    // ...
};

// Return
<script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

---

## 5. Verification Checklist

1.  **Check Sitemap**: Visit `http://localhost:3000/sitemap.xml` and verify all published posts appear.
2.  **Check Robots**: Visit `http://localhost:3000/robots.txt` and verify `/kara/` is disallowed.
3.  **Validate Schema**:
    - Open a blog post.
    - View Page Source.
    - Search for `application/ld+json`.
    - Copy the script content to [Google Rich Results Test](https://search.google.com/test/rich-results) (code snippet mode).

## 6. Next Steps
- **Canonical URLs**: Ensure `process.env.NEXT_PUBLIC_SITE_URL` is set in production.
- **Image Alt**: Ensure all images in Markdown have descriptive alt text.
