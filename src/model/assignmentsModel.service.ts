import { Injectable } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateAssignmentDto } from 'src/assignments/dto/create-assignment.dto';
import { UpdateAssignmentDto } from 'src/assignments/dto/update-assignment.dto';
import { GetAssignmentsQueryDto } from 'src/assignments/dto/get-assignment.dto';

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

  async findAllByClassroom(classroomId: string, query: GetAssignmentsQueryDto) {
    return await this.prisma.assignment.findMany({
      where: {
        classroomId,
        ...(query.title && { title: { contains: query.title } }),
        ...(query.deadline && { deadline: { gte: query.deadline } }),
      },
      skip: query.offset && query.offset > 0 ? query.offset : undefined,
      take: query.limit && query.limit > 0 ? query.limit : undefined,
    });
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
