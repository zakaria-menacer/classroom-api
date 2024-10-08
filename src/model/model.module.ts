import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { PermissionsModelService } from './permissionsModel.service';
import { RolesModelService } from './rolesModel.service';
import { UsersModelService } from './usersModel.service';
import { ClassroomsModelService } from './classroomsModel.service';
import { AssignmentsModelService } from './assignmentsModel.service';
import { FilesModelService } from './filesModel.service';
import { SubmissionsModelService } from './submissionsModel.service';
@Module({
  providers: [
    ModelService,
    RolesModelService,
    PermissionsModelService,
    UsersModelService,
    ClassroomsModelService,
    AssignmentsModelService,
    FilesModelService,
    SubmissionsModelService,
  ],
  exports: [
    RolesModelService,
    PermissionsModelService,
    UsersModelService,
    ClassroomsModelService,
    AssignmentsModelService,
    FilesModelService,
    SubmissionsModelService,
  ],
})
export class ModelModule {}
