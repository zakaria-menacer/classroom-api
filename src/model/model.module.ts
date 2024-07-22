import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { PermissionsModelService } from './permissionsModel.service';
import { RolesModelService } from './rolesModel.service';
import { UsersModelService } from './usersModel.service';

@Module({
  providers: [
    ModelService,
    RolesModelService,
    PermissionsModelService,
    UsersModelService,
  ],
  exports: [RolesModelService, PermissionsModelService, UsersModelService],
})
export class ModelModule {}
