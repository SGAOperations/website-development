-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_parentId_fkey";

-- AlterTable
ALTER TABLE "Version" ADD COLUMN     "author" TEXT,
ADD COLUMN     "versionName" TEXT NOT NULL DEFAULT 'VersionName';

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
