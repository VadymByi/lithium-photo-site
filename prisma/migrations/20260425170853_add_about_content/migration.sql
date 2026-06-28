-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "aboutImageUrl" TEXT,
ADD COLUMN     "aboutText" TEXT NOT NULL DEFAULT 'Place your biography here...',
ADD COLUMN     "aboutTitle" TEXT NOT NULL DEFAULT 'About';
