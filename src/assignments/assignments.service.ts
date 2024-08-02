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

  async findOne(classroomId: string, assignmentId: string) {
    return await this.assignmentsModel.findOne(classroomId, assignmentId);
  }

  async update(
    classroomId: string,
    assignmentId: string,
    data: UpdateAssignmentDto,
  ) {
    return await this.assignmentsModel.update(classroomId, assignmentId, data);
  }

  async remove(classroomId: string, assignmentId: string) {
    const assignment = await this.assignmentsModel.findOne(
      classroomId,
      assignmentId,
    );
    if (!assignment) return;

    await this.assignmentsModel.delete(classroomId, assignmentId);

    //* delete assignment files
    assignment.AssignmentFile.forEach((file) => {
      const fullPath = join(__dirname, '../..', file.path);

      if (existsSync(fullPath)) unlinkSync(fullPath);
    });
  }
}
