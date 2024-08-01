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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRolePermissionDto } from './dto/update-role.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AssignPermissionResponseDto,
  CreateRoleResponseDto,
  DeletePermissionRoleResponseDto,
  GetAllRolesResponseDto,
  GetOneRolesResponseDto,
  UpdateRolePermissionResponseDto,
  UpdateRoleResponseDto,
} from './dto/httpResponse.dto';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('roles')
@ApiTags('roles')
@UseGuards(AuthenticationGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: CreateRoleResponseDto,
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const response = await this.rolesService.create(createRoleDto);
    return { message: 'role created successfully', data: response };
  }

  // ***********************************************************************
  //* GET ALL ROLES
  // ***********************************************************************

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of roles',
    type: GetAllRolesResponseDto,
  })
  async findAll() {
    const response = await this.rolesService.findAll();
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of role',
    type: GetOneRolesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(@Param('id') id: string) {
    const result = await this.rolesService.findOne(id);
    if (!result) throw new NotFoundException('Role not found');

    return result;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: UpdateRoleResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const result = await this.rolesService.update(id, updateRoleDto);
    return { message: 'Role updated successfully', data: result };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id);
    return;
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Update permissions of a role' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiBody({ type: UpdateRolePermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: UpdateRolePermissionResponseDto,
  })
  async updatePermissions(
    @Param('id') id: string,
    @Body() dto: UpdateRolePermissionDto,
  ) {
    const result = await this.rolesService.updatePermissions(
      id,
      dto.permissions,
    );
    console.log(result);

    return { message: 'Role updated successfully', data: result };
  }

  @Delete(':id/permissions/:permission')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove a permission from a role' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiParam({
    name: 'permission',
    type: String,
    description: 'Permission to remove',
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: DeletePermissionRoleResponseDto,
  })
  async removePermission(
    @Param('id') id: string,
    @Param('permission') permission: string,
  ) {
    const result = await this.rolesService.deletePermission(id, permission);
    return { message: 'Role updated successfully', data: result };
  }
  @Patch(':id/permissions/:permission')
  @HttpCode(201)
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiParam({
    name: 'permission',
    type: String,
    description: 'Permission to assign',
  })
  @ApiResponse({
    status: 201,
    description: 'Role updated successfully',
    type: AssignPermissionResponseDto,
  })
  async assignPermission(
    @Param('id') id: string,
    @Param('permission') permission: string,
  ) {
    const result = await this.rolesService.assignPermission(id, permission);
    return { message: 'Role updated successfully', data: result };
  }
}
