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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, GradeDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { Permissions, User } from 'src/tools/custom.decorator';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { join } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import {
  EnrolledSubmissionGuard,
  OwnedClassSubmissionGuard,
} from './submissions.guard';
import {
  CreateSubmissionResponseSchema,
  GetALLSubmissionResponseSchema,
  GetOneSubmissionResponseSchema,
} from './dto/httpResponse.dto';
import { GradeResponseSchema } from 'src/classrooms/dto/httpResponse.dto';

@Controller('/assignments/:assignmentId/submissions')
@ApiTags('submissions')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class AssignmentsSubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  //*******************************************************
  //* CREATE submission
  //*******************************************************

  @Post()
  @Permissions('create:submission')
  @UseGuards(EnrolledSubmissionGuard)
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
  @ApiOperation({ summary: 'Create an assignment submission with  files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload multiple files',

    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        body: {
          type: 'string',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['title'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Assignment created successfully',
    type: CreateSubmissionResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Assignment deadline has passed',
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Assignment deadline has passed',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'You have already submitted this assignment.',
    schema: {
      example: {
        statusCode: 409,
        message: 'You have already submitted this assignment.',
      },
    },
  })
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
        unlinkSync(join(__dirname, '../../../../', file.path));
      });
      throw error;
    }
  }

  //*******************************************************
  //* GET ALL SUBMISSION OF AN ASSIGNMENT
  //*******************************************************

  @Get()
  @Permissions('read:submission')
  @UseGuards(OwnedClassSubmissionGuard)
  @ApiOperation({ summary: 'Get all submission of an assignment' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of submission',
    type: GetALLSubmissionResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'submission given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'submission given does not exists',
      },
    },
  })
  async findAll(@Param('assignmentId') assignmentId: string) {
    return this.submissionsService.findAllByAssignment(assignmentId);
  }
}

@Controller('submissions')
@ApiTags('submissions')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseGuards(AuthenticationGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  //*******************************************************
  //* GET ONE SUBMISSION BY
  //*******************************************************

  @Get(':id')
  @Permissions('read:submission')
  @UseGuards(OwnedClassSubmissionGuard)
  @ApiOperation({ summary: 'Get one submission by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of submission',
    type: GetOneSubmissionResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'submission given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'submission given does not exists',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return await this.submissionsService.findOne(id);
  }

  //*******************************************************
  //* GRADE ONE SUBMISSION BY
  //*******************************************************

  @Patch(':id/grade')
  @Permissions('grade:submission')
  @UseGuards(OwnedClassSubmissionGuard)
  @ApiOperation({ summary: 'Grade submission by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful grade of submission',
    type: GradeResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'submission given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'submission given does not exists',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Grade cannot be higher than the maximum grade',
    schema: {
      example: {
        statusCode: 409,
        message: 'Grade cannot be higher than the maximum grade',
      },
    },
  })
  async grade(@Param('id') id: string, @Body() dto: GradeDto) {
    return await this.submissionsService.grade(id, dto.grade);
  }

  //*******************************************************
  //* REJECT ONE SUBMISSION BY
  //*******************************************************

  @Patch(':id/reject')
  @Permissions('reject:submission')
  @UseGuards(OwnedClassSubmissionGuard)
  @ApiOperation({ summary: 'reject submission by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful reject of submission',
    type: GradeResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'submission given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'submission given does not exists',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Submission is not in a valid state to be rejected',
    schema: {
      example: {
        statusCode: 409,
        message: 'Submission is not in a valid state to be rejected',
      },
    },
  })
  async reject(@Param('id') id: string) {
    return await this.submissionsService.reject(id);
  }
}
