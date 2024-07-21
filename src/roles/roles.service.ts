import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesModelService } from '../model/rolesModel.service';

@Injectable()
export class RolesService {
  constructor(private readonly roleModel: RolesModelService) {}
  async create(dto: CreateRoleDto) {
    //* create role in db
    const result = await this.roleModel.create(dto);
    return result;
  }

  async findAll() {
    const result = await this.roleModel.findAll();
    return result;
  }

  async findOne(id: string) {
    const result = await this.roleModel.findOne(id);
    return result;
  }

  async update(id: string, dto: UpdateRoleDto) {
    const result = await this.roleModel.update(id, dto);
    return result;
  }

  async remove(id: string) {
    return await this.roleModel.delete(id);
  }

  async updatePermissions(id: string, permissions: string[]) {
    //*update permissions
    await this.roleModel.updatePermissions(id, permissions);

    //* return role after update
    return await this.roleModel.findOne(id);
  }

  async assignPermission(id: string, permission: string) {
    await this.roleModel.assignPermission(id, permission);
    //* return role after update
    return await this.roleModel.findOne(id);
  }
  async deletePermission(id: string, permission: string) {
    await this.roleModel.deletePermission(id, permission);
    //* return role after update
    return await this.roleModel.findOne(id);
  }
}
