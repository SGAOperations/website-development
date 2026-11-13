-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
