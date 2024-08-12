import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAssignmentsQueryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDate()
  deadline?: Date;

  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
