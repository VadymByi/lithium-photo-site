-- CreateTable
CREATE TABLE "MainSliderItem" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "backgroundColor" TEXT NOT NULL DEFAULT '#111111',
    "order" INTEGER NOT NULL DEFAULT 0,
    "photoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MainSliderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MainSliderItem" ADD CONSTRAINT "MainSliderItem_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
