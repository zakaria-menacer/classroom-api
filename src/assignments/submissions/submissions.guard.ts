import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { SubmissionsService } from './submissions.service';
import { AssignmentsService } from '../assignments.service';

@Injectable()
export class EnrolledSubmissionGuard implements CanActivate {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly assignmentService: AssignmentsService,
    private readonly classroomsService: ClassroomsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const userId = req?.user?.id;
    if (!userId) return false;

    const assignmentId = req.params.id || req.params.assignmentId;

    const assignment = await this.assignmentService.findOne(assignmentId);
    if (!assignment) {
      throw new NotFoundException('assignment not found');
    }

    const classroom = await this.classroomsService.findOne(
      assignment.classroomId,
    );

    if (!classroom) {
      throw new NotFoundException('classroom not found');
    }

    //* Check if the user is enrolled in the classroom
    return classroom.enrollments.some((e) => e.id === userId);
  }
}
@Injectable()
export class OwnedClassSubmissionGuard implements CanActivate {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly assignmentService: AssignmentsService,
    private readonly classroomsService: ClassroomsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const userId = req?.user?.id;
    if (!userId) return false;

    const submissionId = req.params.id || req.params.submissionId;

    const submission = await this.submissionsService.findOne(submissionId);
    if (!submission) {
      throw new NotFoundException('submission not found');
    }

    const createdBy = submission.AssignmentRef.ClassroomRef.createdBy;

    //* check is the user is the classroom owner
    return createdBy === userId;
  }
}
