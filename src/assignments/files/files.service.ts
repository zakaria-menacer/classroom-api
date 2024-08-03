import { Injectable } from '@nestjs/common';
import { FilesModelService } from 'src/model/filesModel.service';

@Injectable()
export class FilesService {
  constructor(private readonly filesModel: FilesModelService) {}
  async findOneAssignmentFile(id: string) {
    return await this.filesModel.findOneAssignmentFile(id);
  }
  async findOneSubmissionFile(id: string) {
    return await this.filesModel.findOneSubmissionFile(id);
  }
}
