/*
  Warnings:

  - The values [P4K] on the enum `VideoQuality` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `planUsed` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the `FinalRecording` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recording` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RecordingSessionStatus" AS ENUM ('ACTIVE', 'STOPPED', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "SegmentStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "FinalOutputType" AS ENUM ('COMPOSITE', 'PER_PARTICIPANT');

-- CreateEnum
CREATE TYPE "FinalOutputMode" AS ENUM ('MIXED', 'VIDEO_ONLY', 'AUDIO_ONLY');

-- CreateEnum
CREATE TYPE "RenditionStatus" AS ENUM ('READY', 'GENERATING', 'FAILED');

-- AlterEnum
ALTER TYPE "AudioQuality" ADD VALUE 'SR_22050';

-- AlterEnum
BEGIN;
CREATE TYPE "VideoQuality_new" AS ENUM ('P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160');
ALTER TABLE "public"."FinalRecording" ALTER COLUMN "videoQuality" DROP DEFAULT;
ALTER TABLE "ParticipantRecording" ALTER COLUMN "videoQuality" TYPE "VideoQuality_new" USING ("videoQuality"::text::"VideoQuality_new");
ALTER TABLE "FinalOutput" ALTER COLUMN "videoQuality" TYPE "VideoQuality_new" USING ("videoQuality"::text::"VideoQuality_new");
ALTER TYPE "VideoQuality" RENAME TO "VideoQuality_old";
ALTER TYPE "VideoQuality_new" RENAME TO "VideoQuality";
DROP TYPE "public"."VideoQuality_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."FinalRecording" DROP CONSTRAINT "FinalRecording_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Recording" DROP CONSTRAINT "Recording_participantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Recording" DROP CONSTRAINT "Recording_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SpaceParticipant" DROP CONSTRAINT "SpaceParticipant_userId_fkey";

-- DropIndex
DROP INDEX "public"."SpaceParticipant_userId_spaceId_key";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "planUsed";

-- AlterTable
ALTER TABLE "SpaceParticipant" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isUnAuthenticated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "participantSessionId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'GUEST';

-- DropTable
DROP TABLE "public"."FinalRecording";

-- DropTable
DROP TABLE "public"."Recording";

-- CreateTable
CREATE TABLE "RecordingSession" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "recordingSessionId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stoppedAt" TIMESTAMP(3),
    "status" "RecordingSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecordingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantRecording" (
    "id" TEXT NOT NULL,
    "recordingSessionId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "type" "RecordingType" NOT NULL,
    "isScreenShare" BOOLEAN NOT NULL DEFAULT false,
    "container" TEXT,
    "codec" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "fps" INTEGER,
    "bitrate" INTEGER,
    "sampleRate" INTEGER,
    "channels" INTEGER,
    "hasAudio" BOOLEAN NOT NULL DEFAULT false,
    "hasVideo" BOOLEAN NOT NULL DEFAULT false,
    "videoQuality" "VideoQuality",
    "audioQuality" "AudioQuality",
    "videoLabel" TEXT,
    "audioLabel" TEXT,
    "startOffsetMs" INTEGER,
    "durationMs" INTEGER,
    "lastChunkAt" TIMESTAMP(3),
    "fileKey" TEXT,
    "fileSize" BIGINT,
    "checksum" TEXT,
    "mimeType" TEXT,
    "status" "RecordingFileStatus" NOT NULL DEFAULT 'UPLOADING',
    "processingJobId" TEXT,
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParticipantRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordingSegment" (
    "id" TEXT NOT NULL,
    "participantRecordingId" TEXT NOT NULL,
    "recordingSessionId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "assetKey" TEXT NOT NULL,
    "startMs" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "checksum" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SegmentStatus" NOT NULL DEFAULT 'UPLOADED',

    CONSTRAINT "RecordingSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalOutput" (
    "id" TEXT NOT NULL,
    "recordingSessionId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "type" "FinalOutputType" NOT NULL,
    "mode" "FinalOutputMode" NOT NULL DEFAULT 'MIXED',
    "targetParticipantId" TEXT,
    "sourceRecordingId" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "fps" INTEGER,
    "bitrate" INTEGER,
    "sampleRate" INTEGER,
    "channels" INTEGER,
    "hasAudio" BOOLEAN,
    "hasVideo" BOOLEAN,
    "videoQuality" "VideoQuality",
    "audioQuality" "AudioQuality",
    "videoLabel" TEXT,
    "audioLabel" TEXT,
    "thumbnailKey" TEXT,
    "masterKey" TEXT,
    "mimeType" TEXT,
    "durationMs" INTEGER,
    "fileSize" BIGINT,
    "checksum" TEXT,
    "status" "OutputStatus" NOT NULL DEFAULT 'QUEUED',
    "processingJobId" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinalOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalOutputRendition" (
    "id" TEXT NOT NULL,
    "finalOutputId" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "bitrate" INTEGER,
    "codec" TEXT,
    "container" TEXT,
    "assetKey" TEXT,
    "sizeBytes" BIGINT,
    "status" "RenditionStatus" NOT NULL DEFAULT 'GENERATING',
    "jobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalOutputRendition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecordingSession_recordingSessionId_key" ON "RecordingSession"("recordingSessionId");

-- CreateIndex
CREATE INDEX "ParticipantRecording_recordingSessionId_idx" ON "ParticipantRecording"("recordingSessionId");

-- CreateIndex
CREATE INDEX "ParticipantRecording_participantId_idx" ON "ParticipantRecording"("participantId");

-- CreateIndex
CREATE INDEX "ParticipantRecording_status_idx" ON "ParticipantRecording"("status");

-- CreateIndex
CREATE INDEX "RecordingSegment_participantRecordingId_idx" ON "RecordingSegment"("participantRecordingId");

-- CreateIndex
CREATE INDEX "RecordingSegment_participantRecordingId_startMs_idx" ON "RecordingSegment"("participantRecordingId", "startMs");

-- CreateIndex
CREATE INDEX "RecordingSegment_recordingSessionId_idx" ON "RecordingSegment"("recordingSessionId");

-- CreateIndex
CREATE INDEX "RecordingSegment_participantId_idx" ON "RecordingSegment"("participantId");

-- CreateIndex
CREATE INDEX "RecordingSegment_status_idx" ON "RecordingSegment"("status");

-- CreateIndex
CREATE INDEX "FinalOutput_recordingSessionId_idx" ON "FinalOutput"("recordingSessionId");

-- CreateIndex
CREATE INDEX "FinalOutput_spaceId_idx" ON "FinalOutput"("spaceId");

-- CreateIndex
CREATE INDEX "FinalOutput_status_idx" ON "FinalOutput"("status");

-- CreateIndex
CREATE INDEX "FinalOutput_targetParticipantId_idx" ON "FinalOutput"("targetParticipantId");

-- CreateIndex
CREATE INDEX "FinalOutputRendition_finalOutputId_width_height_idx" ON "FinalOutputRendition"("finalOutputId", "width", "height");

-- CreateIndex
CREATE INDEX "FinalOutputRendition_assetKey_idx" ON "FinalOutputRendition"("assetKey");

-- CreateIndex
CREATE UNIQUE INDEX "FinalOutputRendition_finalOutputId_width_height_key" ON "FinalOutputRendition"("finalOutputId", "width", "height");

-- CreateIndex
CREATE INDEX "SpaceParticipant_participantSessionId_idx" ON "SpaceParticipant"("participantSessionId");

-- CreateIndex
CREATE INDEX "SpaceParticipant_spaceId_isActive_idx" ON "SpaceParticipant"("spaceId", "isActive");

-- AddForeignKey
ALTER TABLE "SpaceParticipant" ADD CONSTRAINT "SpaceParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordingSession" ADD CONSTRAINT "RecordingSession_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRecording" ADD CONSTRAINT "ParticipantRecording_recordingSessionId_fkey" FOREIGN KEY ("recordingSessionId") REFERENCES "RecordingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRecording" ADD CONSTRAINT "ParticipantRecording_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "SpaceParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordingSegment" ADD CONSTRAINT "RecordingSegment_participantRecordingId_fkey" FOREIGN KEY ("participantRecordingId") REFERENCES "ParticipantRecording"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalOutput" ADD CONSTRAINT "FinalOutput_recordingSessionId_fkey" FOREIGN KEY ("recordingSessionId") REFERENCES "RecordingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalOutput" ADD CONSTRAINT "FinalOutput_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalOutput" ADD CONSTRAINT "FinalOutput_sourceRecordingId_fkey" FOREIGN KEY ("sourceRecordingId") REFERENCES "ParticipantRecording"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalOutputRendition" ADD CONSTRAINT "FinalOutputRendition_finalOutputId_fkey" FOREIGN KEY ("finalOutputId") REFERENCES "FinalOutput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
