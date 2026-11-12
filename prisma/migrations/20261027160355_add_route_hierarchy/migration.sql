/*
  Warnings:

  - You are about to drop the column `archivedAt` on the `Version` table. All the data in the column will be lost.

*/
-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
