import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://2ea3e48c93133515f69a0b4682d270a80884c6fe8556fba72b181b2c792b474c:sk_-fmadhLM0glC2eeDC_RQN@db.prisma.io:5432/postgres?sslmode=require",
});
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
