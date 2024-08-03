/*
  Warnings:

  - A unique constraint covering the columns `[user_id,assignment_id]` on the table `assignment_Submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "assignment_Submissions_id_assignment_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "assignment_Submissions_user_id_assignment_id_key" ON "assignment_Submissions"("user_id", "assignment_id");
