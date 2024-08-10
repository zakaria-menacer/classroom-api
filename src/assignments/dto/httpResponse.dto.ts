import { Assignment } from '../entities/assignment.entity';

export class CreateAssignmentResponseSchema {
  message = 'success';
  statusCode = 201;
  data: Assignment;
}
export class GetAllAssignmentResponseSchema {
  message = 'success';
  statusCode = 201;
  count: number;
  data: Assignment[];
}

class AssignmentFileSchema {
  id: string;
  name: 'example.pdf';
}

export class GetOneAssignmentResponseSchema {
  message = 'success';
  statusCode = 200;
  data: {
    id: string;
    title: string;
    body?: string;
    created_at?: Date;
    updated_at?: Date;
    classroomId: string;
    maxGrade?: number;
    deadline?: Date;
    AssignmentFile: AssignmentFileSchema[];
  };
}

export class UpdateAssignmentResponseSchema {
  message = 'success';
  statusCode = 200;
  data: Assignment;
}
