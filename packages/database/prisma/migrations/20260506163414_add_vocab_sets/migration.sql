-- AlterTable
ALTER TABLE "VocabProgress" ADD COLUMN     "failureCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastQuality" INTEGER,
ADD COLUMN     "successCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "VocabWord" ADD COLUMN     "setId" TEXT;

-- CreateTable
CREATE TABLE "VocabSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "level" "FinnishLevel" NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '📚',
    "totalWords" INTEGER NOT NULL DEFAULT 0,
    "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VocabSet_category_level_idx" ON "VocabSet"("category", "level");

-- CreateIndex
CREATE INDEX "VocabProgress_userId_easeFactor_idx" ON "VocabProgress"("userId", "easeFactor");

-- CreateIndex
CREATE INDEX "VocabWord_setId_idx" ON "VocabWord"("setId");

-- AddForeignKey
ALTER TABLE "VocabWord" ADD CONSTRAINT "VocabWord_setId_fkey" FOREIGN KEY ("setId") REFERENCES "VocabSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
