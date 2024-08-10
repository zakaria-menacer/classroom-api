import { Permission } from '../entities/permission.entity';

export class GetAllPermissionsResponseSchema {
  message: string = 'success';
  statusCode = 200;
  data: Permission[];
}
