/*
  Warnings:

  - The values [ASSIGNMENT] on the enum `AssessmentType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `termId` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssessmentType_new" AS ENUM ('FIRST_CA', 'SECOND_CA', 'EXAM');
ALTER TABLE "Assessment" ALTER COLUMN "type" TYPE "AssessmentType_new" USING ("type"::text::"AssessmentType_new");
ALTER TYPE "AssessmentType" RENAME TO "AssessmentType_old";
ALTER TYPE "AssessmentType_new" RENAME TO "AssessmentType";
DROP TYPE "AssessmentType_old";
COMMIT;

-- AlterTable
-- Step 1: Add the column as nullable
ALTER TABLE "Assessment" ADD COLUMN "termId" INTEGER;

-- Step 2: Manually update the 9 existing rows with a valid termId
-- You can choose an existing Term ID (e.g., 1)
UPDATE "Assessment" SET "termId" = 1 WHERE "termId" IS NULL;

-- Step 3: Now make the column NOT NULL
ALTER TABLE "Assessment" ALTER COLUMN "termId" SET NOT NULL;
-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "academicYearId" INTEGER NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_year_key" ON "AcademicYear"("year");

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
