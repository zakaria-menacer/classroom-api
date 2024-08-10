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
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import {
  OwnedClassroomsGuard,
  OwnedOrEnrolledClassroomsGuard,
} from 'src/classrooms/classrooms.guard';
import { Permissions } from 'src/tools/custom.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateAssignmentResponseSchema,
  GetAllAssignmentResponseSchema,
  GetOneAssignmentResponseSchema,
  UpdateAssignmentResponseSchema,
} from './dto/httpResponse.dto';
import {
  OwnedAssignmentGuard,
  OwnedOrEnrolledAssignmentGuard,
} from './assignments.guard';

@Controller('/classrooms/:classroomId/assignments')
@ApiTags('assignments')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class AssignmentsClassroomController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  //*******************************************************
  //* CREATE ASSIGNMENT
  //*******************************************************

  @Post()
  @Permissions('create:assignment')
  @UseGuards(OwnedClassroomsGuard)
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
  @ApiOperation({ summary: 'Create a new assignment with  files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Classroom created successfully',
  })
  @ApiBody({
    description: 'Upload multiple files',

    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        body: {
          type: 'string',
        },
        maxGrade: {
          type: 'number',
        },
        deadline: {
          type: 'string',
          format: 'date-time',
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
    type: CreateAssignmentResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Assignment given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'Assignment given does not exists',
      },
    },
  })
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

  //*******************************************************
  //* GET ALL ASSIGNMENT OF A CLASSROOM
  //*******************************************************

  @Get()
  @Permissions('read:assignment')
  @UseGuards(OwnedOrEnrolledClassroomsGuard)
  @ApiOperation({ summary: 'Get all assignments by classroom' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of assignments',
    type: GetAllAssignmentResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Classroom given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'Classroom given does not exists',
      },
    },
  })
  async findAll(@Param('classroomId') classroomId: string) {
    return await this.assignmentsService.findAll(classroomId);
  }
}

@ApiTags('assignments')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('/assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}
  // *****************************************************
  //* GET ASSIGNMENT BY ID
  // *****************************************************

  @Get(':id')
  @Permissions('read:assignment')
  @UseGuards(OwnedOrEnrolledAssignmentGuard)
  @ApiOperation({ summary: 'Get an assignment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of assignments',
    type: GetOneAssignmentResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'assignment given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'assignment given does not exists',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    const result = await this.assignmentsService.findOne(id);
    if (!result) throw new NotFoundException('Assignment not found');
    return result;
  }

  // *****************************************************
  //* UPDATE ASSIGNMENT
  // *****************************************************

  @Patch(':id')
  @Permissions('update:assignment')
  @UseGuards(OwnedAssignmentGuard)
  @ApiOperation({ summary: 'Update assignment' })
  @ApiResponse({
    status: 200,
    description:
      'Successful update of assignment. Returns the updated assignment',
    type: UpdateAssignmentResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'assignment given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'assignment given does not exists',
      },
    },
  })
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

  // *****************************************************
  //* Delete ASSIGNMENT
  // *****************************************************

  @Delete(':id')
  @Permissions('delete:assignment')
  @UseGuards(OwnedAssignmentGuard)
  @ApiOperation({ summary: 'delete  assignment' })
  @ApiResponse({
    status: 204,
    description: 'Successful delete of assignment',
  })
  @ApiResponse({
    status: 400,
    description: 'assignment given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'assignment given does not exists',
      },
    },
  })
  async remove(
    @Param('id') id: string,
    @Param('classroomId') classroomId: string,
  ) {
    await this.assignmentsService.remove(classroomId, id);
    return;
  }
}
