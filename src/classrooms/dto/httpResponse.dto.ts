import { ApiProperty } from '@nestjs/swagger';
import { Classroom } from '../entities/classroom.entity';
import { User } from '@prisma/client';
import { Submission } from 'src/assignments/submissions/entities/submission.entity';

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
    // enrollments: User;
  };
}

export class EnrollResponseSchema {
  message: 'user enrolled successfully';
  statusCode = 201;
  data: {
    userId: string;
    classroomId: string;
    created_at: '2024-04-09T16:16:30.949Z';
    updated_at: '2024-04-09T16:16:30.949Z';
  };
}

export class GradeResponseSchema {
  message: 'success';
  statusCode = 2000;
  data: Submission;
}
