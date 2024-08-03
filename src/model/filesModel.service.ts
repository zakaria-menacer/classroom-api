import { Injectable } from '@nestjs/common';
import { ModelService } from './model.service';

@Injectable()
export class FilesModelService {
  constructor(private readonly prisma: ModelService) {}
  async findOneAssignmentFile(id: string) {
    return await this.prisma.assignmentFile.findUnique({ where: { id } });
  }
  async findOneSubmissionFile(id: string) {
    return await this.prisma.submissionFile.findUnique({ where: { id } });
  }
}
