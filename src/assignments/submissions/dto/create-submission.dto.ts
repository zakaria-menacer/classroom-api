import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsOptional()
  @IsString()
  body?: string;
}

export class GradeDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  grade?: number;
}
