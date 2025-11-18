## CreativeDev.Lab Site

A marketing website and blog powered by **Next.js App Router**, **Supabase**, **Drizzle ORM**, and **shadcn/ui**. The app implements the full SRS from the root README: conversion-focused landing page, blog (list + post detail with OG tags and related stories), Supabase-authenticated admin CMS with storage-backed cover uploads, Storybook docs, and a generated sitemap.

### Highlights

- Hero, feature grid, blog preview, and contact CTA sections composed with shadcn/ui components and Tailwind CSS 4.
- Blog list includes optimized cover images (Next/Image), excerpts, reading time, and pagination (ISR revalidation every 60s).
- Blog detail routes are statically generated with `generateStaticParams`, dynamic metadata/OG, and related posts.
- Admin dashboard, post editor (rich text + Supabase Storage image uploads), and deletion flows are restricted through Supabase Auth + middleware role checks.
- Content is stored via Drizzle ORM with RLS policies allowing only admins to write.
- Automatic `sitemap.xml`, reusable utilities, and Storybook stories for key components.

### Getting Started

1. Duplicate `.env.example` → `.env.local` and provide the Supabase project values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=blog-images
   DATABASE_URL=postgresql://user:pass@host/db
   ```

   Create the storage bucket referenced in `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` and make it public (or add signed URL logic).

2. Apply the Drizzle migrations (tables + RLS):

   ```bash
   npm run db:generate && npm run db:push # or use drizzle-kit push
   ```

   Ensure your Supabase project contains an admin profile (`profiles` table with `role = 'admin'` for your auth user).

3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Visit `/auth/sign-up` to create an account, update the corresponding profile row to `role = 'admin'`, then access `/admin`.

### Available Scripts

| Command            | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `npm run dev`      | Next.js dev server                                                  |
| `npm run build`    | Production build (includes ISR + metadata setup)                    |
| `npm run start`    | Start production server                                             |
| `npm run lint`     | ESLint                                                              |
| `npm run storybook`| Storybook docs for the Hero + Blog Card components                   |

### Architecture Notes

- `app/layout.tsx` defines global metadata and shells the Header/Footer.
- `app/page.tsx` (landing), `app/blog/page.tsx`, and `app/blog/[slug]/page.tsx` are statically generated and revalidated every 60s.
- `app/admin/*` uses server components plus client-side forms powered by shadcn `Form`, `Switch`, `AlertDialog`, and a custom rich text editor.
- `middleware.ts` enforces Supabase Auth + role-based access for `/admin`.
- `lib/supabase/queries.ts` centralizes Drizzle queries for posts/slugs/pagination.
- `app/sitemap.ts` automatically harvests published posts for SEO.

Refer to the root README (SRS) for detailed system requirements; this app now satisfies each of them. Happy shipping!
