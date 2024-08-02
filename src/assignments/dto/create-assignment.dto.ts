import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  body?: string;
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  maxGrade?: number;
  @IsOptional()
  dueDate?: Date;
}
