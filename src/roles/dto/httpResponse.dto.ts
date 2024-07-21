import { OmitType } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';

export class CreateRoleResponseDto {
  message: string = 'role created successfully';
  statusCode: number = 201;
  data: OneRoleResponse;
}
export class GetAllRolesResponseDto {
  message: string = 'success';
  statusCode: number = 200;
  count: number;
  data: OneRoleResponse[];
}
export class GetOneRolesResponseDto {
  message: string = 'success';
  statusCode: number = 200;
  data: Role;
}
export class UpdateRoleResponseDto {
  message: string = 'Role updated successfully';
  statusCode: number = 200;
  data: Role;
}

export class UpdateRolePermissionResponseDto extends UpdateRoleResponseDto {}
export class AssignPermissionResponseDto extends UpdateRoleResponseDto {}
export class DeletePermissionRoleResponseDto extends UpdateRoleResponseDto {}

class OneRoleResponse extends OmitType(Role, ['permissions'] as const) {}
