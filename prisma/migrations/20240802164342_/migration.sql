-- AlterTable
ALTER TABLE "assignment_Submissions" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';

-- AddForeignKey
ALTER TABLE "assignment_Submissions" ADD CONSTRAINT "assignment_Submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_Submissions" ADD CONSTRAINT "assignment_Submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
