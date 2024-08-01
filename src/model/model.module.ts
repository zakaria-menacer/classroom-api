import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { PermissionsModelService } from './permissionsModel.service';
import { RolesModelService } from './rolesModel.service';
import { UsersModelService } from './usersModel.service';
import { ClassroomsModelService } from './classroomsModel.service';

@Module({
  providers: [
    ModelService,
    RolesModelService,
    PermissionsModelService,
    UsersModelService,
    ClassroomsModelService,
  ],
  exports: [
    RolesModelService,
    PermissionsModelService,
    UsersModelService,
    ClassroomsModelService,
  ],
})
export class ModelModule {}
