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
import { User } from 'src/tools/custom.decorator';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import {
  AdminClassroomsResponseDto,
  CreateClassroomResponseSchema,
  GetOneClassroomResponseSchema,
  NonAdminClassroomsResponseDto,
} from './dto/httpResponse.dto';
import { ClassroomsGuard } from './classrooms.guard';

@Controller('classrooms')
@ApiTags('classrooms')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard)
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  //***********************************************************
  //* CREATE CLASSROOM
  //***********************************************************

  @Post()
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

  //***********************************************************
  //* GET ALL CLASSROOMS
  //***********************************************************

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
  async findAll(@User() user) {
    if ((user?.permissions as string[]).includes('read:classroom:all'))
      return this.classroomsService.findAllForAdmin();
    return await this.classroomsService.findAll(user.id);
  }

  // ***********************************************************
  //* GET CLASSROOM BY ID
  //***********************************************************

  @Get(':id')
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

  // ***********************************************************
  //* UPDATE CLASSROOM
  //***********************************************************

  @Patch(':id')
  @UseGuards(ClassroomsGuard)
  update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomsService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(ClassroomsGuard)
  async remove(@Param('id') id: string) {
    await this.classroomsService.remove(id);
    return;
  }

  @Post(':classroomId/users/:userId')
  async enroll(
    @Param('classroomId') classroomId: string,
    @Param('userId') userId: string,
  ) {
    const response = await this.classroomsService.enroll(userId, classroomId);
    return { message: 'user enrolled successfully', data: response };
  }
  @Delete(':classroomId/users/:userId')
  async unenroll(
    @Param('classroomId') classroomId: string,
    @Param('userId') userId: string,
  ) {
    const response = await this.classroomsService.unenroll(userId, classroomId);
    return { message: 'user unenrolled successfully' };
  }
}
