-- CreateTable
CREATE TABLE "UserStory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "level" "FinnishLevel" NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'AI Generated',
    "color" TEXT NOT NULL DEFAULT 'from-violet-500 to-purple-600',
    "text" TEXT NOT NULL,
    "vocab" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 40,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserStory_userId_idx" ON "UserStory"("userId");

-- CreateIndex
CREATE INDEX "UserStory_userId_level_idx" ON "UserStory"("userId", "level");

-- AddForeignKey
ALTER TABLE "UserStory" ADD CONSTRAINT "UserStory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
