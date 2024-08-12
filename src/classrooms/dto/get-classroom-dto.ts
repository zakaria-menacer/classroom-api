import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetClassroomsQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
