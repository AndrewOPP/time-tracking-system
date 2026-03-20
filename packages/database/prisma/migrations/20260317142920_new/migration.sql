-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('BILLABLE', 'NON_BILLABLE');

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'BILLABLE';
