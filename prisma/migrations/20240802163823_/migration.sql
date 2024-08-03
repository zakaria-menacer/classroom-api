/*
  Warnings:

  - You are about to drop the column `submittedAt` on the `assignment_Submissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assignment_Submissions" DROP COLUMN "submittedAt",
ADD COLUMN     "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
