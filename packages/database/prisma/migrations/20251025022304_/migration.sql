/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[supabaseId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supabaseId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "provider",
DROP COLUMN "providerId",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "supabaseId" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");
