import { Injectable } from '@nestjs/common';
import { ModelService } from './model.service';

@Injectable()
export class PermissionsModelService {
  constructor(private readonly prisma: ModelService) {}

  async findAll() {
    const response = await this.prisma.permission.findMany();
    return response;
  }
}
