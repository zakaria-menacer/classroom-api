import { Injectable } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateAssignmentDto } from 'src/assignments/dto/create-assignment.dto';
import { UpdateAssignmentDto } from 'src/assignments/dto/update-assignment.dto';

@Injectable()
export class AssignmentsModelService {
  constructor(private readonly prisma: ModelService) {}
  async create(
    classroomId: string,
    data: CreateAssignmentDto,
    files: Array<Express.Multer.File>,
  ) {
    let assignment;
    await this.prisma.$transaction(async (tx) => {
      assignment = await tx.assignment.create({
        data: { ...data, ClassroomRef: { connect: { id: classroomId } } },
      });
      if (files) {
        for (let i = 0; i < files.length; i++) {
          await tx.assignmentFile.create({
            data: {
              id: files[i].filename,
              name: files[i].originalname,
              path: files[i].path,
              AssignmentRef: { connect: { id: assignment.id } },
            },
          });
        }
      }
    });
    return assignment;
  }

  async findAllByClassroom(classroomId: string) {
    return await this.prisma.assignment.findMany({ where: { classroomId } });
  }

  async findOne(assignmentId: string) {
    return await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { AssignmentFile: true },
    });
  }
  async update(
    classroomId: string,
    assignmentId: string,
    data: UpdateAssignmentDto,
  ) {
    return await this.prisma.assignment.update({
      where: { classroomId, id: assignmentId },
      data,
    });
  }

  async delete(assignmentId: string) {
    return await this.prisma.assignment.delete({
      where: { id: assignmentId },
    });
  }
}
