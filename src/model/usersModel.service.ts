import { Injectable } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
  async getOne(id: string) {
    console.log(id);

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
    console.log(result);

    return { ...result, role, permissions };
  }
}
