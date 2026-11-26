-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
