import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { Permissions } from 'src/tools/custom.decorator';
import { GetAllPermissionsResponseSchema } from './dto/httpResponses.dto';

@Controller('permissions')
@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('read:role')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of permissions',
    type: GetAllPermissionsResponseSchema,
  })
  async findAll() {
    return await this.permissionsService.findAll();
  }
}
