import { ApiProperty } from '@nestjs/swagger';
import { Classroom } from '../entities/classroom.entity';
import { User } from '@prisma/client';

export class CreateClassroomResponseSchema {
  message = 'classroom created successfully';
  statusCode = 201;
  data: Classroom;
}

export class AdminClassroomsResponseDto {
  @ApiProperty({
    example: 'All classrooms retrieved successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({ type: [Classroom], description: 'List of all classrooms' })
  data: Classroom[];
}

export class NonAdminClassroomsResponseDto {
  @ApiProperty({
    example: 'User classrooms retrieved successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    type: [Classroom],
    description: 'List of classrooms owned by the user',
  })
  ownedClassrooms: Classroom[];

  @ApiProperty({
    type: [Classroom],
    description: 'List of classrooms the user is enrolled in',
  })
  enrolledClassrooms: Classroom[];
}

export class GetOneClassroomResponseSchema {
  message = 'success';
  statusCode = 200;
  data: {
    id: string;
    createdBy: string;
    name: string;
    description: string;
    enrollments: Array<User>;
  };
}
