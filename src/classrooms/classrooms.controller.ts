import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions, User } from 'src/tools/custom.decorator';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import {
  AdminClassroomsResponseDto,
  CreateClassroomResponseSchema,
  EnrollResponseSchema,
  GetOneClassroomResponseSchema,
  NonAdminClassroomsResponseDto,
} from './dto/httpResponse.dto';
import {
  AdminOrOwnedClassroomsGuard,
  OwnedOrEnrolledClassroomsGuard,
} from './classrooms.guard';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { GetClassroomsQueryDto } from './dto/get-classroom-dto';

@Controller('classrooms')
@ApiTags('classrooms')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  //*******************************************************
  //* CREATE CLASSROOM
  //*******************************************************

  @Post()
  @Permissions('create:classroom')
  @ApiOperation({ summary: 'Create a Classroom' })
  @ApiResponse({
    status: 201,
    description: 'Classroom created successfully',
    type: CreateClassroomResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'User given does not exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'User given does not exists',
      },
    },
  })
  async create(@Body() createClassroomDto: CreateClassroomDto, @User() user) {
    const createdBy = user.id;
    const response = await this.classroomsService.create(
      createdBy,
      createClassroomDto,
    );
    return { message: 'classroom created successfully', data: response };
  }

  //**************************************************
  //* GET ALL CLASSROOMS
  //**************************************************

  @Get()
  @ApiOperation({ summary: 'Get classrooms' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of classrooms for non-admin users',
    type: NonAdminClassroomsResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of classrooms for admin',
    type: AdminClassroomsResponseDto,
  })
  async findAll(@User() user, @Query() query: GetClassroomsQueryDto) {
    if ((user?.permissions as string[]).includes('read:classroom:all'))
      return this.classroomsService.findAllForAdmin(query);
    delete query.createdBy;
    return await this.classroomsService.findAll(user.id, query);
  }

  // ********************************************************
  //* GET CLASSROOM BY ID
  //******************************************************

  @Get(':id')
  @UseGuards(OwnedOrEnrolledClassroomsGuard)
  @Permissions('read:classroom')
  @ApiOperation({ summary: 'Get a classroom by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of classroom',
    type: GetOneClassroomResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Classroom not found',
    schema: {
      example: {
        statusCode: 400,
        message: 'Classroom not found',
      },
    },
  })
  async findOne(@Param('id') classroomId: string) {
    const result = await this.classroomsService.findOne(classroomId);
    if (!result) throw new NotFoundException('Classroom not found');

    return result;
  }

  // *******************************************************
  //* UPDATE CLASSROOM
  //********************************************************

  @Patch(':id')
  @Permissions('update:classroom')
  @UseGuards(AdminOrOwnedClassroomsGuard)
  @ApiOperation({ summary: 'Update a classroom ' })
  @ApiResponse({
    status: 200,
    description: 'Successful update of classroom',
    type: GetOneClassroomResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Classroom not found',
    schema: {
      example: {
        statusCode: 400,
        message: 'Classroom not found',
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomsService.update(id, updateClassroomDto);
  }

  // *******************************************************
  //* DELETE CLASSROOM
  //********************************************************

  @Delete(':id')
  @HttpCode(204)
  @Permissions('delete:classroom')
  @UseGuards(AdminOrOwnedClassroomsGuard)
  @ApiOperation({ summary: 'delete a classroom ' })
  @ApiResponse({
    status: 204,
    description: 'Successful delete of classroom',
  })
  @ApiResponse({
    status: 400,
    description: 'Classroom not found',
    schema: {
      example: {
        statusCode: 400,
        message: 'Classroom not found',
      },
    },
  })
  async remove(@Param('id') id: string) {
    await this.classroomsService.remove(id);
    return;
  }

  @Post(':classroomId/enroll')
  @ApiOperation({ summary: 'enroll to  a classroom ' })
  @ApiResponse({
    status: 201,
    description: 'Successful enrollment',
    type: EnrollResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'User is already enrolled in this classroom',
    schema: {
      example: {
        statusCode: 400,
        message: 'User is already enrolled in this classroom',
      },
    },
  })
  async enroll(@Param('classroomId') classroomId: string, @User() user) {
    const response = await this.classroomsService.enroll(user.id, classroomId);
    return { message: 'user enrolled successfully', data: response };
  }
  @Delete(':classroomId/enroll')
  @HttpCode(204)
  @ApiResponse({
    status: 400,
    description: 'User is already enrolled in this classroom',
    schema: {
      example: {
        statusCode: 400,
        message: 'User is already enrolled in this classroom',
      },
    },
  })
  async unenroll(@Param('classroomId') classroomId: string, @User() user) {
    await this.classroomsService.unenroll(user.id, classroomId);
    return;
  }
}
