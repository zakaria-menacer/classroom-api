import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateClassroomDto } from 'src/classrooms/dto/create-classroom.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateClassroomDto } from 'src/classrooms/dto/update-classroom.dto';

@Injectable()
export class ClassroomsModelService {
  constructor(private readonly prisma: ModelService) {}
  async create(createdBy: string, data: CreateClassroomDto) {
    return await this.prisma.classroom.create({
      data: { ...data, UserRef: { connect: { id: createdBy } } },
    });
  }

  async enroll(userId: string, classroomId: string) {
    try {
      const classroom = await this.prisma.classroom.findUnique({
        where: { id: classroomId },
      });

      if (classroom.createdBy === userId) {
        throw new BadRequestException("you can't enroll in your own classroom");
      }

      return await this.prisma.enrollment.create({
        data: {
          ClassroomRef: { connect: { id: classroomId } },
          UserRef: { connect: { id: userId } },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
        //* P2002 == "Unique constraint failed on the {constraint}"
      )
        throw new ConflictException(
          'User is already enrolled in this classroom',
        );
      throw error;
    }
  }
  async findAllForAdmin() {
    return await this.prisma.classroom.findMany({});
  }
  async findAll(userId: string) {
    const ownedClassrooms = await this.prisma.classroom.findMany({
      where: { createdBy: userId },
    });
    const enrolledClassrooms = (
      await this.prisma.enrollment.findMany({
        where: { userId },
        select: { ClassroomRef: true },
      })
    ).map((val) => val.ClassroomRef);

    return { ownedClassrooms, enrolledClassrooms };
  }
  async findOne(classroomId: string) {
    const result = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
      include: {
        Enrollment: {
          select: {
            UserRef: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    if (!result) throw new NotFoundException('Classroom not found');

    const enrollments = result.Enrollment.map((val) => val.UserRef);
    delete result.Enrollment;
    return { ...result, enrollments };
  }

  async update(classroomId: string, data: UpdateClassroomDto) {
    return await this.prisma.classroom.update({
      where: { id: classroomId },
      data,
    });
  }
  async delete(classroomId: string) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.enrollment.deleteMany({ where: { classroomId } });
      await tx.classroom.deleteMany({ where: { id: classroomId } });
    });
  }

  async unenroll(userId: string, classroomId: string) {
    return await this.prisma.enrollment.delete({
      where: { userId_classroomId: { userId, classroomId } },
    });
  }
}
