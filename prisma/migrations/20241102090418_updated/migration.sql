-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
