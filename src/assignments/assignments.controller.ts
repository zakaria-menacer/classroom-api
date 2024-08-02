import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import * as fs from 'fs';

@Controller('/classrooms/:classroomId/assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination(req, file, cb) {
          const uploadPath = './uploads/assignments';
          // Ensure the directory exists
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
      }),
    }),
  )
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('classroomId') classroomId: string,
  ) {
    return await this.assignmentsService.create(
      classroomId,
      createAssignmentDto,
      files,
    );
  }

  @Get()
  async findAll(@Param('classroomId') classroomId: string) {
    return await this.assignmentsService.findAll(classroomId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Param('classroomId') classroomId: string,
  ) {
    const result = await this.assignmentsService.findOne(classroomId, id);
    if (!result) throw new NotFoundException('Assignment not found');
    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Param('classroomId') classroomId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return await this.assignmentsService.update(
      classroomId,
      id,
      updateAssignmentDto,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Param('classroomId') classroomId: string,
  ) {
    return await this.assignmentsService.remove(classroomId, id);
  }
}
