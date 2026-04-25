-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showPortfolio" BOOLEAN NOT NULL DEFAULT true,
    "showProjects" BOOLEAN NOT NULL DEFAULT true,
    "showContacts" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);
