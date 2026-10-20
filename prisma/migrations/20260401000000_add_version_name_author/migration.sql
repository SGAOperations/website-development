-- AlterTable
ALTER TABLE "Version" ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'SGA Webmaster',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Version Name';
