import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '../user/domain/user';
import { ApiLogin } from './swagger/login.swagger';
import { ApiRefreshToken } from './swagger/refresh-token.swagger';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() loginDto: AuthEmailLoginDto): Promise<{
    token: string;
    refreshToken: string;
    tokenExpires: number;
    user: User;
  }> {
    return this.authService.validateLogin(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiRefreshToken()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<{
    token: string;
    refreshToken: string;
    tokenExpires: number;
  }> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
