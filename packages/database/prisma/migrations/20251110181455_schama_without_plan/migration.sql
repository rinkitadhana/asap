/*
  Warnings:

  - You are about to drop the column `localUpload` on the `Recording` table. All the data in the column will be lost.
  - You are about to drop the `PlanUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PlanUsage" DROP CONSTRAINT "PlanUsage_userId_fkey";

-- DropIndex
DROP INDEX "public"."FinalRecording_spaceId_idx";

-- AlterTable
ALTER TABLE "Recording" DROP COLUMN "localUpload";

-- DropTable
DROP TABLE "public"."PlanUsage";
