-- Remap removed roles to a surviving value before switching the enum
UPDATE "users" SET "role" = 'MANAGER' WHERE "role" IN ('ACCOUNTS', 'SALES');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- Promote the primary account to super admin
UPDATE "users" SET "role" = 'SUPER_ADMIN' WHERE "email" = 'njmilon1@gmail.com';
