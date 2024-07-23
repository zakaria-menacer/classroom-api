import { Injectable } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class UsersModelService {
  constructor(private readonly prisma: ModelService) {}
  async create(dto: Omit<CreateUserDto, 'password'> & { id: string }) {
    const { roleId, ...data } = dto;
    const result = await this.prisma.user.create({
      data: { ...data, roleRef: { connect: { id: roleId } } },
    });
    return result;
  }
  async findOne(id: string) {
    const result = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roleRef: { include: { permissions: { select: { permission: true } } } },
      },
    });
    if (!result) return undefined;
    const permissions = result.roleRef.permissions.map((val) => val.permission);
    const { permissions: tmp, ...role } = result.roleRef;
    delete result.roleRef;
    delete result.roleId;

    return { ...result, role, permissions };
  }
  async findAll() {
    const result = await this.prisma.user.findMany();
    return result;
  }

  async update(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async assignRole(id: string, roleId: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { roleRef: { connect: { id: roleId } } },
    });
  }
}
