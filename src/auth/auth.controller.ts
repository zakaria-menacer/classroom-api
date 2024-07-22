import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseSchema } from './dto/httpResponse.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
}
