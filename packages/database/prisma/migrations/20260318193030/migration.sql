/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('BILLABLE', 'NON_BILLABLE');

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'BILLABLE';

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
