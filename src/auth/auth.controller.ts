import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/domain/user';
import { ApiLogin } from './swagger/login.swagger';
import { ApiRefreshToken } from './swagger/refresh-token.swagger';
import { ApiRegister } from './swagger/register.swagger';
import { ApiVerifyOtp } from './swagger/verify-otp.swagger';
import { ApiResendOtp } from './swagger/resend-otp.swagger';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiRegister()
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.authService.register(createUserDto);
  }

  @Post('email/verify-otp')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiVerifyOtp()
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otpCode);
  }

  @Post('email/resend-otp')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiResendOtp()
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<{ message: string }> {
    return this.authService.resendOtp(resendOtpDto.email);
  }

  @Post('email/login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
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
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
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
