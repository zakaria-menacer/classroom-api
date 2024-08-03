import { ConflictException, Injectable } from '@nestjs/common';
import { ModelService } from './model.service';

import { CreateSubmissionDto } from 'src/assignments/submissions/dto/create-submission.dto';

@Injectable()
export class SubmissionsModelService {
  constructor(private readonly prisma: ModelService) {}
  async create(
    assignmentId: string,
    data: CreateSubmissionDto,
    userId: string,
    files: Array<Express.Multer.File>,
  ) {
    let submissions;
    try {
      await this.prisma.$transaction(async (tx) => {
        submissions = await tx.assignmentSubmission.create({
          data: {
            ...data,
            UserRef: { connect: { id: userId } },
            AssignmentRef: { connect: { id: assignmentId } },
          },
        });
        if (files) {
          for (let i = 0; i < files.length; i++) {
            await tx.submissionFile.create({
              data: {
                id: files[i].filename,
                name: files[i].originalname,
                path: files[i].path,
                SubmissionRef: { connect: { id: submissions.id } },
              },
            });
          }
        }
      });
    } catch (error) {
      if (
        error.code == 'P2002' &&
        ['user_id', 'assignment_id'].every(
          (val, index) => val == error.meta.target[index],
        )
      ) {
        throw new ConflictException(
          'You have already submitted this assignment.',
        );
      }
    }
    return submissions;
  }

  async findAllByAssignment(assignmentId: string) {
    return (
      await this.prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: { AssignmentSubmission: true },
      })
    ).AssignmentSubmission;
  }

  async findOne(submission_id: string) {
    return await this.prisma.assignmentSubmission.findUnique({
      where: { id: submission_id },
      include: {
        SubmissionFile: true,
        AssignmentRef: { include: { ClassroomRef: true } },
      },
    });
  }

  async grade(submission_id: string, grade: number) {
    const submission = await this.findOne(submission_id);
    if (submission.AssignmentRef.maxGrade < grade)
      throw new ConflictException(
        'Grade cannot be higher than the maximum grade',
      );
    if (grade < 0) throw new ConflictException('Grade cannot be lower than 0');

    if (submission.status != 'SUBMITTED')
      throw new ConflictException(
        'Submission is not in a valid state to be graded',
      );

    return await this.prisma.assignmentSubmission.update({
      where: { id: submission_id },
      data: { grade: Number(grade.toFixed(2)), status: 'GRADED' },
    });
  }

  async reject(submission_id: string) {
    const submission = await this.findOne(submission_id);
    if (submission.status != 'SUBMITTED')
      throw new ConflictException(
        'Submission is not in a valid state to be rejected',
      );

    return await this.prisma.assignmentSubmission.update({
      where: { id: submission_id },
      data: { status: 'REJECTED' },
    });
  }
}
