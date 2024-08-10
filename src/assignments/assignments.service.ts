import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentsModelService } from 'src/model/assignmentsModel.service';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class AssignmentsService {
  constructor(private readonly assignmentsModel: AssignmentsModelService) {}
  async create(
    classroomId: string,
    data: CreateAssignmentDto,
    files: Array<Express.Multer.File>,
  ) {
    return await this.assignmentsModel.create(classroomId, data, files);
  }

  async findAll(classroomId: string) {
    return await this.assignmentsModel.findAllByClassroom(classroomId);
  }

  async findOne(assignmentId: string) {
    const assignment = await this.assignmentsModel.findOne(assignmentId);
    if (assignment?.AssignmentFile) {
      for (let i = 0; i < assignment.AssignmentFile.length; i++) {
        delete assignment.AssignmentFile[i].path;
        delete assignment.AssignmentFile[i].assignmentId;
      }
    }
    return assignment;
  }

  async update(
    classroomId: string,
    assignmentId: string,
    data: UpdateAssignmentDto,
  ) {
    return await this.assignmentsModel.update(classroomId, assignmentId, data);
  }

  async remove(classroomId: string, assignmentId: string) {
    const assignment = await this.assignmentsModel.findOne(assignmentId);
    if (!assignment) return;

    await this.assignmentsModel.delete(assignmentId);

    //* delete assignment files
    assignment.AssignmentFile.forEach((file) => {
      const fullPath = join(__dirname, '../..', file.path);

      if (existsSync(fullPath)) unlinkSync(fullPath);
    });
  }
}
