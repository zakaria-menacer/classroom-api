import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionsModelService } from 'src/model/submissionsModel.service';
import { AssignmentsModelService } from 'src/model/assignmentsModel.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly submissionsModel: SubmissionsModelService,
    private readonly assignmentsModel: AssignmentsModelService,
  ) {}

  async create(
    assignmentId: string,
    data: CreateSubmissionDto,
    userId: string,
    files: Array<Express.Multer.File>,
  ) {
    const assignment = await this.assignmentsModel.findOne(assignmentId);

    if (
      assignment.deadline &&
      new Date(assignment.deadline).getTime() > new Date().getTime()
    ) {
      throw new ForbiddenException('Assignment deadline has passed');
    }

    return await this.submissionsModel.create(
      assignmentId,
      data,
      userId,
      files,
    );
  }

  async findAllByAssignment(assignmentId: string) {
    return await this.submissionsModel.findAllByAssignment(assignmentId);
  }

  async findOne(id: string) {
    const result = await this.submissionsModel.findOne(id);
    if (!result) throw new NotFoundException('Submission not found');
    return result;
  }

  async grade(id: string, grade: number) {
    return await this.submissionsModel.grade(id, grade);
  }

  async reject(id: string) {
    return await this.submissionsModel.reject(id);
  }
}
