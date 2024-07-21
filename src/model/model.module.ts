import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { PermissionsModelService } from './permissionsModel.service';
import { RolesModelService } from './rolesModel.service';

@Module({
  providers: [ModelService, RolesModelService, PermissionsModelService],
  exports: [RolesModelService, PermissionsModelService],
})
export class ModelModule {}
