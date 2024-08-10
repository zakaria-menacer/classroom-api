import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  firstName?: string;
  @IsNotEmpty()
  @IsString()
  lastName?: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'Username',
  })
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
  @IsOptional()
  @IsString()
  mobilePhone?: string;
}
