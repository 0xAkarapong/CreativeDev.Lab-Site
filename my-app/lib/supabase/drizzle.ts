import { drizzle, type NodePgDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

let client: ReturnType<typeof postgres> | null = null;
let database: NodePgDatabase<typeof schema> | null = null;

if (connectionString) {
  client = postgres(connectionString);
  database = drizzle(client, { schema });
}

export const db = database;
export const isDatabaseConfigured = Boolean(database);
