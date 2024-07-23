import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserOktaService } from 'src/okta/user-okta.service';
import { RolesModelService } from 'src/model/rolesModel.service';
import { UsersModelService } from 'src/model/usersModel.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userOktaService: UserOktaService,
    private readonly roleModel: RolesModelService,
    private readonly userModel: UsersModelService,
    private readonly authService: AuthService,
  ) {}
  async create(dto: CreateUserDto) {
    // * before creating user in okta
    // * we verify if the role given exists in the db
    // * to avoid inserting in okta and then
    // * deleting the user after finding that the role don't exist in the db
    const role = await this.roleModel.findOne(dto.roleId);
    if (!role) {
      throw new BadRequestException("role given don't exists");
    }

    // * create user on okta
    // * to get user id from okta
    const user = await this.userOktaService.create(dto);
    const password = dto.password;
    delete dto.password;
    //* create user without password in db
    await this.userModel.create({ ...dto, id: user.id });

    //* respond with id token and user infos
    const response = await this.authService.login({
      username: dto.email,
      password: password,
    });

    return response;
  }

  async findAll() {
    const result = await this.userModel.findAll();
    return result;
  }

  async findOne(id: string) {
    return await this.userModel.findOne(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    //* update user in okta first
    await this.userOktaService.update(id, dto);

    //* update user in db
    return await this.userModel.update(id, dto);
  }

  async remove(id: string) {
    //* remove first from okta
    await this.userOktaService.deactivate(id);
    await this.userOktaService.delete(id);

    //* delete from db
    await this.userModel.delete(id);
  }

  async assignRole(id: string, roleId: string) {
    return await this.userModel.assignRole(id, roleId);
  }
}
