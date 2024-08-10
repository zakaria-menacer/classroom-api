import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserResponseSchema,
  GetAllUsersResponseSchema,
  UpdateUserResponseSchema,
} from './dto/httpResponses.dto';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { Permissions, User } from 'src/tools/custom.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //****************************************
  //**          CREATE USER          ******
  //****************************************

  @Post()
  @Permissions('create:user')
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'user already exists',
    schema: {
      example: {
        statusCode: 400,
        message:
          'login: An object with this field already exists in the current organization',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['password must be longer than or equal to 8 characters'],
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return { message: 'user created successfully', data: result };
  }

  //****************************************
  //**          GET ALL USERS        ******
  //****************************************

  @Get()
  @Permissions('read:user')
  @ApiOperation({ summary: 'Get  all users' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of users',
    type: GetAllUsersResponseSchema,
  })
  async findAll() {
    return await this.usersService.findAll();
  }

  //****************************************
  //**          GET ME         ******
  //****************************************
  @Get('me')
  @ApiOperation({ summary: 'Get Current User Details' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of users',
    type: GetAllUsersResponseSchema,
  })
  async findMe(@User() user) {
    return await this.usersService.findOne(user.id);
  }

  //****************************************
  //**          UPDATE ME          ******
  //****************************************

  @Patch('me')
  @ApiOperation({ summary: 'Update Current User' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UpdateUserResponseSchema,
  })
  async updateMe(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(user.id, updateUserDto);
  }

  //****************************************
  //**          DELETE ME          ******
  //****************************************

  @Delete('me')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete current user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async removeMe(@User() user) {
    await this.usersService.remove(user.id);
    return;
  }

  //****************************************
  //**          GET ONE USER BY ID         ******
  //****************************************

  @Get(':id')
  @Permissions('read:user')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of user',
    type: CreateUserResponseSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'user not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(id);
    if (!result) throw new NotFoundException('User not found');
    return result;
  }

  //****************************************
  //**          UPDATE USER         ******
  //****************************************

  @Patch(':id')
  @Permissions('update:user')
  @ApiOperation({ summary: 'Update a User' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UpdateUserResponseSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'user not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Not found: Resource not found: 00uixxxxxxxxxL5d7 (User)',
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  //****************************************
  //**          DELETE USER         ******
  //****************************************

  @Delete(':id')
  @Permissions('delete:user')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a User' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return;
  }

  //****************************************
  //**          ASSIGN ROLE TO A USER         ******
  //****************************************
  @Post(':id/roles/:roleId')
  @Permissions('update:user')
  @ApiOperation({ summary: 'Assign a role to  a User' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: UpdateUserResponseSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'user not found',
    schema: {
      example: {
        statusCode: 404,
        message: '(Role|User) given does not exists',
      },
    },
  })
  async assignRole(@Param('id') id: string, @Param('roleId') roleId: string) {
    return await this.usersService.assignRole(id, roleId);
  }
}
