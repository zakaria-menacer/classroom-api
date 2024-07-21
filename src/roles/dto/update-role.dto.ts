import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  @Transform(({ value }) => value.toUpperCase())
  name: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;
}
export class UpdateRolePermissionDto {
  @IsArray()
  @IsString({ each: true })
  // @IsOptional()
  permissions: string[];
}
