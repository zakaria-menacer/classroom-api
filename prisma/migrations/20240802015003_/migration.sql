-- DropForeignKey
ALTER TABLE "assignment_files" DROP CONSTRAINT "assignment_files_assignment_id_fkey";

-- AddForeignKey
ALTER TABLE "assignment_files" ADD CONSTRAINT "assignment_files_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
