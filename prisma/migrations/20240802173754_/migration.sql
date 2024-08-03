/*
  Warnings:

  - A unique constraint covering the columns `[id,assignment_id]` on the table `assignment_Submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "assignment_Submissions_id_assignment_id_key" ON "assignment_Submissions"("id", "assignment_id");
