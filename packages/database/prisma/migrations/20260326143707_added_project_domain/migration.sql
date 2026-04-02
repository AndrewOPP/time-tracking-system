-- CreateEnum
CREATE TYPE "ProjectDomain" AS ENUM ('FINTECH', 'HEALTHCARE', 'E_COMMERCE', 'FOODTECH', 'EDTECH');

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "domain" "ProjectDomain";
