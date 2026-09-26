import "server-only";

import { Pool } from "pg";
import { requireEnv } from "@/lib/env";

const globalForDatabase = globalThis as typeof globalThis & {
  databasePool?: Pool;
};

// Reuse the pool across development hot reloads. Connections open on first query.
export function getDatabase(): Pool {
  if (!globalForDatabase.databasePool) {
    const pool = new Pool({
      connectionString: requireEnv("DATABASE_URL"),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    pool.on("error", () => {
      console.error("An idle PostgreSQL connection encountered an error.");
    });

    globalForDatabase.databasePool = pool;
  }

  return globalForDatabase.databasePool;
}
