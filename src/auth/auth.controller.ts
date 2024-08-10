import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginResponseSchema,
  RegisterResponseSchema,
} from './dto/httpResponse.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 201,
    description: 'login successfully',
    type: LoginResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'The credentials provided were invalid',
    schema: {
      example: {
        statusCode: 400,
        timestamp: '2024-07-22T20:35:44.106Z',
        message: 'The credentials provided were invalid.',
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    const response = await this.authService.login(dto);
    return { message: 'success', data: response };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: RegisterResponseSchema,
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
  async register(@Body() dto: RegisterDto) {
    const result = await this.usersService.create({
      ...dto,
      roleId: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      //* set default role "MEMBER"
    });
    return { message: 'user created successfully', data: result };
  }
}
