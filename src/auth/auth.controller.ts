import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { QueryRunner } from 'typeorm';

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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyPasswordResetOtpDto } from './dto/verify-password-reset-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ApiForgotPassword,
  ApiResetPassword,
  ApiVerifyPasswordResetOtp,
} from './swagger/password-reset.swagger';
import { QueryRunnerInterceptor } from '../utils/interceptors/query-runner.interceptor';
import { TransactionQueryRunner } from '../utils/decorators/transaction-query-runner.decorator';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/register')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiRegister()
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.authService.register(createUserDto);
  }

  @Post('email/verify-otp')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiVerifyOtp()
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otpCode);
  }

  @Post('email/resend-otp')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiResendOtp()
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<{ message: string }> {
    return this.authService.resendOtp(resendOtpDto.email);
  }

  @Post('email/forgot-password')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiForgotPassword()
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.requestPasswordReset(forgotPasswordDto.email);
  }

  @Post('email/verify-password-reset-otp')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiVerifyPasswordResetOtp()
  async verifyPasswordResetOtp(
    @Body() dto: VerifyPasswordResetOtpDto,
  ): Promise<{ resetToken: string; expiresInSeconds: number }> {
    return this.authService.verifyPasswordResetOtp(dto.email, dto.otpCode);
  }

  @Post('email/reset-password')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @UseInterceptors(QueryRunnerInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiResetPassword()
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(
      dto.email,
      dto.resetToken,
      dto.newPassword,
      queryRunner,
    );
  }

  @Post('email/login')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
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
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
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
