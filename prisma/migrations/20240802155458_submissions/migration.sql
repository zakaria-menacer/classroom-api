-- CreateEnum
CREATE TYPE "submission_status" AS ENUM ('SUBMITTED', 'GRADED', 'REJECTED');

-- CreateTable
CREATE TABLE "assignment_Submissions" (
    "id" TEXT NOT NULL,
    "body" TEXT,
    "assignment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "grade" DOUBLE PRECISION,
    "status" "submission_status" NOT NULL,

    CONSTRAINT "assignment_Submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,

    CONSTRAINT "submission_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "submission_files" ADD CONSTRAINT "submission_files_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "assignment_Submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
