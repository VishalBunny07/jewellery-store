import "server-only";
import { Pool } from "pg";

const globalForPostgres = globalThis as typeof globalThis & {
  jewelleryAuthPool?: Pool;
};

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

export const db = globalForPostgres.jewelleryAuthPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.jewelleryAuthPool = db;
}
