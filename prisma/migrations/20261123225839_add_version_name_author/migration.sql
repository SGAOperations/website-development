-- AlterTable
ALTER TABLE "Version" ADD COLUMN     "author" TEXT,
ADD COLUMN     "versionName" TEXT NOT NULL DEFAULT 'VersionName';
