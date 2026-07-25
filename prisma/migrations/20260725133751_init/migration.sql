-- CreateTable
CREATE TABLE "workshops" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "imageBg" TEXT,
    "imagePosition" TEXT,
    "color" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "closing" TEXT NOT NULL,
    "highlights" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workshops_slug_key" ON "workshops"("slug");
