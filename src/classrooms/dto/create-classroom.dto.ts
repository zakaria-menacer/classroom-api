import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
}
