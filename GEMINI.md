# Project Overview

This project is a modern, SEO-optimized website with a high-conversion landing page and a dynamic blog. It is built with Next.js (App Router) for the frontend and Supabase for the backend. Drizzle ORM is used for type-safe database interactions, and the UI is constructed with shadcn/ui components.

## Key Technologies

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
*   **Backend:** Supabase (PostgreSQL)
*   **ORM:** Drizzle ORM
*   **Authentication:** Supabase Auth
*   **UI Documentation:** Storybook

## Architecture

The application follows a standard client-server architecture:

*   **Client:** A web browser that accesses the landing page and blog.
*   **Edge Network (Vercel):** Serves cached static content for fast load times.
*   **Server (Next.js):** Queries data via Drizzle ORM during build time or request time.
*   **Database (Supabase):** Stores blog content, author profiles, and metadata.
*   **Asset Store (Supabase):** Serves images via a CDN.

# Building and Running

## Prerequisites

*   Node.js
*   npm
*   A Supabase project with the database connection string set in a `.env` file as `DATABASE_URL`.

## Key Commands

*   **`npm run dev`**: Runs the development server.
*   **`npm run build`**: Builds the application for production.
*   **`npm run start`**: Starts the production server.
*   **`npm run lint`**: Lints the code.
*   **`npm run db:generate`**: Generates database migrations using Drizzle Kit.
*   **`npm run storybook`**: Runs Storybook for UI component documentation.
*   **`npm run build-storybook`**: Builds the Storybook documentation.

# Development Conventions

## Coding Style

The project uses TypeScript and follows the standard Next.js coding conventions. ESLint is configured to enforce a consistent coding style.

## Database

The database schema is defined in `lib/supabase/schema.ts` using Drizzle ORM. Migrations are managed with Drizzle Kit.

## Components

UI components are built with shadcn/ui and are located in the `components/ui` directory. Storybook is used for documenting and testing UI components.
