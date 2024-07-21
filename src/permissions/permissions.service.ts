import { Injectable } from '@nestjs/common';
import { PermissionsModelService } from 'src/model/permissionsModel.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsModel: PermissionsModelService) {}

  async findAll() {
    const response = await this.permissionsModel.findAll();
    return response;
  }
}
