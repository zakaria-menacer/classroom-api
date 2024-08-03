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
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, GradeDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { User } from 'src/tools/custom.decorator';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { join } from 'path';

@Controller('/assignments/:assignmentId/submissions')
@UseGuards(AuthenticationGuard)
export class AssignmentsSubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination(req, file, cb) {
          const uploadPath = './uploads/submissions';
          // Ensure the directory exists
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateSubmissionDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('assignmentId') assignmentId: string,
    @User() user,
  ) {
    try {
      return await this.submissionsService.create(
        assignmentId,
        dto,
        user.id,
        files,
      );
    } catch (error) {
      // * if error delete all files
      files.forEach((file) => {
        unlinkSync(join(__dirname, '../../../', file.path));
      });
      throw error;
    }
  }
  @Get()
  async findAll(@Param('assignmentId') assignmentId: string) {
    return this.submissionsService.findAllByAssignment(assignmentId);
  }
}

@Controller('/submissions')
@UseGuards(AuthenticationGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.submissionsService.findOne(id);
  }

  @Patch(':id/grade')
  async grade(@Param('id') id: string, @Body() dto: GradeDto) {
    return await this.submissionsService.grade(id, dto.grade);
  }
  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    return await this.submissionsService.reject(id);
  }
}
