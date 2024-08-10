import { Submission } from '../entities/submission.entity';

export class CreateSubmissionResponseSchema {
  message = 'success';
  statusCode = 201;
  data: {
    id: string;
    body: string;
    assignmentId: string;
    userId: string;
    submittedAt: Date;
    updated_at: Date;
    status: 'SUBMITTED';
  };
}
export class GetALLSubmissionResponseSchema {
  message = 'success';
  statusCode = 201;
  data: Submission[];
}

class FileSchema {
  id: string;
  name = 'example.pdf';
}
export class GetOneSubmissionResponseSchema {
  'message' = 'success';
  'statusCode' = 200;
  'data': {
    id: string;
    body: string;
    assignmentId: string;
    userId: string;
    submittedAt: Date;
    updated_at: Date;
    grade: number;
    status: string;
    SubmissionFile: FileSchema[];
  };
}
