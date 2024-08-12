import { Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomsModelService } from 'src/model/classroomsModel.service';
import { GetClassroomsQueryDto } from './dto/get-classroom-dto';

@Injectable()
export class ClassroomsService {
  constructor(private readonly classroomsModel: ClassroomsModelService) {}
  async create(createdBy: string, dto: CreateClassroomDto) {
    return await this.classroomsModel.create(createdBy, dto);
  }

  async findAll(userId: string, query: GetClassroomsQueryDto) {
    return await this.classroomsModel.findAll(userId, query);
  }
  async findAllForAdmin(query: GetClassroomsQueryDto) {
    return await this.classroomsModel.findAllForAdmin(query);
  }

  async findOne(classroomId: string) {
    return await this.classroomsModel.findOne(classroomId);
  }

  async update(id: string, dto: UpdateClassroomDto) {
    return await this.classroomsModel.update(id, dto);
  }

  async remove(id: string) {
    return await this.classroomsModel.delete(id);
  }
  async enroll(userId: string, classroomId: string) {
    return await this.classroomsModel.enroll(userId, classroomId);
  }
  async unenroll(userId: string, classroomId: string) {
    return await this.classroomsModel.unenroll(userId, classroomId);
  }
}
