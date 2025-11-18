import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/supabase/schema.ts",
  out: "./lib/supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
