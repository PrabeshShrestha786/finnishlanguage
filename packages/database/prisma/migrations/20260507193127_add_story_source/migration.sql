-- AlterTable
ALTER TABLE "UserStory" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'reading';

-- CreateIndex
CREATE INDEX "UserStory_userId_source_idx" ON "UserStory"("userId", "source");
