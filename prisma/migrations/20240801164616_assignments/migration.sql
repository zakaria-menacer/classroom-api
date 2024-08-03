-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "classroom_id" TEXT NOT NULL,
    "maxGrade" DOUBLE PRECISION,
    "deadline" TIMESTAMP(3),
    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "assignment_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    CONSTRAINT "assignment_files_pkey" PRIMARY KEY ("id")
);
-- AddForeignKey
ALTER TABLE "assignments"
ADD CONSTRAINT "assignments_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "assignment_files"
ADD CONSTRAINT "assignment_files_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;