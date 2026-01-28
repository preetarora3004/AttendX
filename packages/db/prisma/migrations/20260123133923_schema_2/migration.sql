/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "total_strength" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_key" ON "Class"("name");
