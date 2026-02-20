/*
  Warnings:

  - You are about to drop the column `discord_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'GITHUB', 'DISCORD', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'MANAGER', 'HR', 'ACCOUNTANT', 'ADMIN');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "discord_id",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" "AuthProvider" NOT NULL,
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "refresh_token_hash" TEXT,
ADD COLUMN     "systemRole" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_providerId_key" ON "user"("providerId");
