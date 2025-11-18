System Requirements Specification (SRS)
Project: Next.js + Supabase Website (Landing Page & Blog)
Version: 1.3
Date: 2025-11-18
1. Introduction
1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for a modern, SEO-optimized website consisting of a high-conversion Landing Page and a dynamic Blog.
1.2 Scope
The system will be a web application built using Next.js (App Router) for the frontend and Supabase for the backend. Drizzle ORM will be used for type-safe database interactions. The UI will be constructed using shadcn/ui components to ensure accessibility and design consistency.
2. System Architecture & Technology Stack
2.1 Tech Stack
Component
Technology
Justification
Frontend Framework
Next.js 16 (App Router)
Provides the latest React optimizations, Server-Side Rendering (SSR), and improved caching mechanisms.
Language
TypeScript
Ensures type safety and code maintainability.
Styling
Tailwind CSS 4.0
Latest engine for utility-first CSS with improved performance and simplified configuration.
Component Library
shadcn/ui
A collection of re-usable components built using Radix UI and Tailwind CSS. Provides excellent accessibility and copy-paste customization.
UI Documentation
Storybook
Isolated environment for building, testing, and documenting UI components independently of the main app.
Backend / Database
Supabase (PostgreSQL)
Provides a managed Postgres database with built-in APIs.
ORM
Drizzle ORM
Lightweight, type-safe ORM for defining schemas and querying the database with zero runtime overhead.
Authentication
Supabase Auth
Handles secure admin login/session management.
File Storage
Supabase Storage
Stores blog post cover images and assets.
Deployment
Vercel (Frontend)
Native optimization for Next.js features.

2.2 High-Level Architecture
Client: Browser accesses the Landing Page and Blog.
Edge Network (Vercel): Serves cached static content (ISR) for fast load times.
Server (Next.js): Queries data via Drizzle ORM during build time or request time.
Database (Supabase): Stores blog content, author profiles, and metadata.
Asset Store (Supabase): Serves images via CDN.
3. Functional Requirements
3.1 Module 1: Public Facing (Landing Page)
FR-01: Hero Section
The system must display a responsive Hero section with a headline, subheadline, and primary Call-to-Action (CTA) button (using shadcn Button).
Requirement: Largest Contentful Paint (LCP) must occur within 2.5s.
FR-02: Features/Services Grid
The system must render a grid layout displaying core value propositions, utilizing shadcn Card components for consistency.
FR-03: Responsive Navigation
The system must include a navigation bar that collapses into a hamburger menu on mobile devices.
Implementation Note: Use shadcn Navigation Menu for desktop and Sheet (Sidebar) for mobile navigation.
FR-04: Footer
The system must display copyright info, social links, and secondary navigation.
3.2 Module 2: Public Facing (Blog)
FR-05: Blog Index (List View)
The system must display a list of published articles using shadcn Card or aspect-ratio components for images.
Each card must show: Cover Image, Title, Excerpt, Date, and Reading Time.
Pagination or "Load More" functionality must be implemented.
FR-06: Blog Post Detail (Single View)
The system must render Markdown or Rich Text content fetched via Drizzle.
The page must dynamically generate Open Graph (OG) meta tags for social sharing based on the specific post title and image.
A "Related Posts" section should be suggested at the bottom.
3.3 Module 3: Administration (CMS)
FR-07: Admin Authentication
The system must allow administrators to log in via Email/Password using Supabase Auth.
Public users cannot access admin routes (/admin/*); these must be protected by Middleware.
Login forms must utilize shadcn Form, Input, and Label components with Zod validation.
FR-08: Create/Edit Post
The system must provide a rich text editor.
Admins must be able to upload a cover image to Supabase Storage buckets.
Admins must be able to set a custom URL slug.
FR-09: Post Management
Admins must be able to toggle post status between Draft and Published (using shadcn Switch or Select).
Admins must be able to delete posts (using shadcn AlertDialog for confirmation).
4. Database Schema (Supabase PostgreSQL via Drizzle)
4.1 Table: profiles (Admin Users)
id (UUID, Primary Key, references auth.users)
full_name (Text)
avatar_url (Text)
role (Text) - e.g., 'admin', 'editor'
4.2 Table: posts
id (UUID, Primary Key)
created_at (Timestamp with time zone)
updated_at (Timestamp with time zone)
title (Text, Not Null)
slug (Text, Unique, Not Null)
content (Text/JSONB) - Stores the body of the blog post.
excerpt (Text) - Short summary for SEO/Previews.
cover_image_url (Text)
is_published (Boolean, Default: false)
author_id (UUID, Foreign Key references profiles.id)
4.3 Security (Row Level Security - RLS)
Public Access: SELECT allowed on posts where is_published = true.
Admin Access: SELECT, INSERT, UPDATE, DELETE allowed for authenticated users with admin role.
5. Non-Functional Requirements
5.1 Performance
Static Generation: Blog posts must utilize generateStaticParams to pre-render pages at build time.
ISR (Incremental Static Regeneration): The system should revalidate content (e.g., every 60 seconds).
Image Optimization: All images must use the next/image component.
5.2 SEO (Search Engine Optimization)
Sitemap: The system must automatically generate a sitemap.xml.
Metadata: Every page must have unique <title> and <meta name="description"> tags.
Semantic HTML: Use proper HTML5 tags (<article>, <section>, <header>).
5.3 Accessibility
The application must achieve a Lighthouse Accessibility score of >90.
Component Standard: All interactive elements must use shadcn/ui primitives (based on Radix UI) to ensure keyboard navigation and screen reader support out of the box.
6. Implementation Roadmap
Setup: Initialize Next.js 16 project, configure Supabase, and install Tailwind CSS 4.0.
UI Foundation: Run npx shadcn@latest init to configure the base styles.
Database Layer: Install Drizzle ORM and drizzle-kit. Define schemas and generate migrations.
Component Library: Install core shadcn components (Button, Card, Input, Sheet, Form, Dialog, DropdownMenu). Document them in Storybook.
UI/UX Implementation: Assemble the Landing Page using the installed shadcn components.
Data Fetching: Create Drizzle queries to fetch blog data within Server Components.
Blog Logic: Build dynamic routing app/blog/[slug]/page.tsx.
Admin: Implement Auth and the Dashboard for creating posts using shadcn forms and tables.
Optimization: Add SEO metadata, Sitemap generation, and Analytics.


