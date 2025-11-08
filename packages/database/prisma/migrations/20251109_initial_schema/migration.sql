-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PRO', 'BUSINESS');

-- CreateEnum
CREATE TYPE "SpaceStatus" AS ENUM ('LIVE', 'ENDED', 'PROCESSING', 'READY');

-- CreateEnum
CREATE TYPE "RecordingStatus" AS ENUM ('IDLE', 'RECORDING', 'STOPPED');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('HOST', 'CO_HOST', 'GUEST');

-- CreateEnum
CREATE TYPE "RecordingType" AS ENUM ('AUDIO', 'VIDEO');

-- CreateEnum
CREATE TYPE "RecordingFileStatus" AS ENUM ('UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "VideoQuality" AS ENUM ('P720', 'P1080', 'P1440', 'P4K');

-- CreateEnum
CREATE TYPE "AudioQuality" AS ENUM ('SR_44100', 'SR_48000', 'SR_96000');

-- CreateEnum
CREATE TYPE "OutputStatus" AS ENUM ('QUEUED', 'PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "plan" "PlanType" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "joinCode" TEXT NOT NULL,
    "status" "SpaceStatus" NOT NULL DEFAULT 'LIVE',
    "recordingStatus" "RecordingStatus" NOT NULL DEFAULT 'IDLE',
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "planUsed" "PlanType" NOT NULL DEFAULT 'FREE',
    "totalRecordingHours" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceParticipant" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "hasRecording" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SpaceParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "type" "RecordingType" NOT NULL,
    "videoQuality" "VideoQuality",
    "audioQuality" "AudioQuality",
    "uploadedChunks" JSONB NOT NULL,
    "fileUrl" TEXT,
    "fileSize" BIGINT,
    "status" "RecordingFileStatus" NOT NULL DEFAULT 'UPLOADING',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "localUpload" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalRecording" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "status" "OutputStatus" NOT NULL DEFAULT 'PROCESSING',
    "finalVideo" TEXT,
    "videoQuality" "VideoQuality" NOT NULL DEFAULT 'P1080',
    "audioQuality" "AudioQuality" NOT NULL DEFAULT 'SR_48000',
    "duration" INTEGER,
    "fileSize" BIGINT,
    "finalAudio" TEXT,
    "separateTracks" JSONB,
    "processingStarted" TIMESTAMP(3),
    "processingEnded" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinalRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "hoursUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hoursCap" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Space_joinCode_key" ON "Space"("joinCode");

-- CreateIndex
CREATE INDEX "SpaceParticipant_spaceId_idx" ON "SpaceParticipant"("spaceId");

-- CreateIndex
CREATE INDEX "SpaceParticipant_userId_idx" ON "SpaceParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceParticipant_userId_spaceId_key" ON "SpaceParticipant"("userId", "spaceId");

-- CreateIndex
CREATE INDEX "Recording_spaceId_idx" ON "Recording"("spaceId");

-- CreateIndex
CREATE INDEX "Recording_participantId_idx" ON "Recording"("participantId");

-- CreateIndex
CREATE INDEX "Recording_type_idx" ON "Recording"("type");

-- CreateIndex
CREATE UNIQUE INDEX "FinalRecording_spaceId_key" ON "FinalRecording"("spaceId");

-- CreateIndex
CREATE INDEX "FinalRecording_spaceId_idx" ON "FinalRecording"("spaceId");

-- CreateIndex
CREATE INDEX "FinalRecording_status_idx" ON "FinalRecording"("status");

-- CreateIndex
CREATE INDEX "PlanUsage_userId_idx" ON "PlanUsage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanUsage_userId_month_key" ON "PlanUsage"("userId", "month");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceParticipant" ADD CONSTRAINT "SpaceParticipant_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceParticipant" ADD CONSTRAINT "SpaceParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "SpaceParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalRecording" ADD CONSTRAINT "FinalRecording_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanUsage" ADD CONSTRAINT "PlanUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

