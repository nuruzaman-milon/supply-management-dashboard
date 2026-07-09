import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://2ea3e48c93133515f69a0b4682d270a80884c6fe8556fba72b181b2c792b474c:sk_-fmadhLM0glC2eeDC_RQN@db.prisma.io:5432/postgres?sslmode=require";

// Cache BOTH the client and the underlying pool on globalThis. In dev, Next
// re-evaluates this module on hot reload; without caching we'd spin up a new
// pg pool each time and leak connections against the DB's limited budget —
// which is what surfaces as "Unable to start a transaction in the given time".
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString,
    // Keep our footprint small (Prisma Postgres caps connections) but recycle
    // idle connections quickly so the pool doesn't sit on the DB's budget.
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
