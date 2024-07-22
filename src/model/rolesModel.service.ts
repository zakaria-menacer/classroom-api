import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/roles/dto/update-role.dto';

@Injectable()
export class RolesModelService {
  constructor(private readonly prisma: ModelService) {}

  async create(data: CreateRoleDto) {
    data.name = data.name.toUpperCase();
    const result = await this.prisma.role.create({
      data: { ...data },
    });
    return result;
  }
  async findAll() {
    const result = await this.prisma.role.findMany();
    return result;
  }

  async findOne(id: string) {
    const result = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: { select: { permission: true } } },
    });
    if (!result) return undefined;
    const permissions = result.permissions.map((val) => val.permission);
    return { ...result, permissions };
  }
  async update(id: string, data: UpdateRoleDto) {
    const result = await this.prisma.role.update({
      where: { id },
      data,
    });
    return result;
  }
  async delete(id: string) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { role: id } });
      await tx.role.delete({ where: { id } });
    });
  }
  async updatePermissions(id: string, permissions: string[]) {
    //*test if role exists
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    //*transaction
    //*delete all permissions then add all new permissions
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.rolePermission.deleteMany({ where: { role: id } });
        for (let i = 0; i < permissions.length; i++) {
          await tx.rolePermission.create({
            data: {
              rolesRef: { connect: { id } },
              permissionsRef: { connect: { name: permissions[i] } },
            },
          });
        }
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async assignPermission(id: string, permission: string) {
    await this.prisma.rolePermission.create({
      data: {
        rolesRef: { connect: { id } },
        permissionsRef: { connect: { name: permission } },
      },
    });
    return;
  }
  async deletePermission(id: string, permission: string) {
    await this.prisma.rolePermission.delete({
      where: { role_permission: { permission, role: id } },
    });
    return;
  }
}
