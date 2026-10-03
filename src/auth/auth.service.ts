import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { QueryRunner } from 'typeorm';

import { UserService } from '../user/user.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import {
  AuthInvalidCredentials,
  AuthInvalidRefreshToken,
  AuthEmailNotVerified,
  AuthOtpInvalid,
  AuthOtpExpired,
  AuthOtpTooManyAttempts,
  AuthOtpResendTooSoon,
  AuthPasswordResetInvalid,
} from './exceptions/auth.exceptions';
import { AllConfigType } from '../config/config.type';
import { User } from '../user/domain/user';
import { userFindOneAuthLogin } from '../user/infrastructure/relations-and-selects-options';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { OtpRepository } from './infrastructure/otp.repository';
import { OtpTypeEnum } from '../utils/enums/otp-type.enum';
import { MailService } from '../mail/mail.service';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { UserEmailAlreadyExistsException } from '../user/exceptions/user.exceptions';

const OTP_EXPIRY_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = 10;
const DUMMY_PASSWORD_HASH =
  '$2b$10$EoZmIMI33cOEkoFnOg8zK.DuChUy8QoUa3R8wxf80EQr.UwgHkiS2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly otpRepository: OtpRepository,
    private readonly mailService: MailService,
  ) {}

  // ─── Registration ──────────────────────────────────────────────

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const response = {
      message:
        'If this email can be registered, a verification code has been sent.',
    };

    let user: User;
    try {
      user = await this.userService.create({ createUserDto });
    } catch (error) {
      if (error instanceof UserEmailAlreadyExistsException) {
        return response;
      }
      throw error;
    }

    // Generate and send OTP
    await this.generateAndSendOtp(user.id, user.email!, user.firstName);

    return response;
  }

  // ─── OTP Generation ────────────────────────────────────────────

  async generateAndSendOtp(
    userId: number,
    email: string,
    userName?: string | null,
  ): Promise<void> {
    // Generate a 6-digit code
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // Hash the code before storing
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(otpCode, salt);

    // Delete any existing OTPs for this user + type (one active at a time)
    await this.otpRepository.deleteAllByUserAndType(
      userId,
      OtpTypeEnum.EMAIL_VERIFICATION,
    );

    // Save hashed OTP with expiry
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.otpRepository.create({
      userId,
      hash,
      type: OtpTypeEnum.EMAIL_VERIFICATION,
      expiresAt,
    });

    // Send email
    await this.mailService.sendOtp(email, otpCode, userName ?? undefined);
  }

  // ─── OTP Verification ──────────────────────────────────────────

  async verifyOtp(
    email: string,
    otpCode: string,
  ): Promise<{ message: string }> {
    // Find user by email
    const user = await this.userService.findOneByEmail({ email });

    if (!user) {
      throw new AuthOtpInvalid();
    }

    // If already verified, return success (idempotent)
    if (user.emailVerified) {
      return { message: 'Email is already verified.' };
    }

    // Find latest OTP
    const otp = await this.otpRepository.findLatestByUserAndType(
      user.id,
      OtpTypeEnum.EMAIL_VERIFICATION,
    );

    if (!otp) {
      throw new AuthOtpInvalid();
    }

    // Check max attempts
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      throw new AuthOtpTooManyAttempts();
    }

    // Check expiry
    if (otp.expiresAt < new Date()) {
      throw new AuthOtpExpired();
    }

    // Compare OTP
    const isValid = await bcrypt.compare(otpCode, otp.hash);

    if (!isValid) {
      // Increment attempt counter
      await this.otpRepository.incrementAttempts(otp.id);
      throw new AuthOtpInvalid();
    }

    // OTP is valid — mark email as verified
    await this.userService.markEmailVerified({ id: user.id });

    // Clean up OTP records
    await this.otpRepository.deleteAllByUserAndType(
      user.id,
      OtpTypeEnum.EMAIL_VERIFICATION,
    );

    return { message: 'Email verified successfully.' };
  }

  // ─── Resend OTP ────────────────────────────────────────────────

  async resendOtp(email: string): Promise<{ message: string }> {
    const genericMessage =
      'If your email is registered and unverified, a new verification code has been sent.';

    // Find user — return generic message to prevent email enumeration
    const user = await this.userService.findOneByEmail({ email });

    if (!user) {
      return { message: genericMessage };
    }

    // If already verified, just return generic message
    if (user.emailVerified) {
      return { message: genericMessage };
    }

    // Check cooldown — don't allow resend if last OTP was sent < 60s ago
    const existingOtp = await this.otpRepository.findLatestByUserAndType(
      user.id,
      OtpTypeEnum.EMAIL_VERIFICATION,
    );

    if (existingOtp) {
      const secondsSinceCreated =
        (Date.now() - existingOtp.createdAt.getTime()) / 1000;

      if (secondsSinceCreated < OTP_RESEND_COOLDOWN_SECONDS) {
        throw new AuthOtpResendTooSoon();
      }
    }

    // Generate and send new OTP
    await this.generateAndSendOtp(user.id, user.email!, user.firstName);

    return { message: genericMessage };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const genericMessage =
      'If an eligible account exists for this email, a reset code has been sent.';
    const user = await this.userService.findOneByEmail({ email });

    if (!user?.email || !user.emailVerified) {
      return { message: genericMessage };
    }

    const existingOtp = await this.otpRepository.findLatestByUserAndType(
      user.id,
      OtpTypeEnum.PASSWORD_RESET,
    );
    if (
      existingOtp &&
      (Date.now() - existingOtp.createdAt.getTime()) / 1000 <
        OTP_RESEND_COOLDOWN_SECONDS
    ) {
      return { message: genericMessage };
    }

    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const hash = await bcrypt.hash(otpCode, await bcrypt.genSalt());

    await this.otpRepository.deleteAllByUserAndType(
      user.id,
      OtpTypeEnum.PASSWORD_RESET,
    );
    await this.otpRepository.create({
      userId: user.id,
      hash,
      type: OtpTypeEnum.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      verifiedAt: null,
    });

    try {
      await this.mailService.sendPasswordResetOtp(
        user.email,
        otpCode,
        user.firstName ?? undefined,
      );
    } catch {
      await this.otpRepository.deleteAllByUserAndType(
        user.id,
        OtpTypeEnum.PASSWORD_RESET,
      );
    }

    return { message: genericMessage };
  }

  async verifyPasswordResetOtp(
    email: string,
    otpCode: string,
  ): Promise<{ resetToken: string; expiresInSeconds: number }> {
    const user = await this.userService.findOneByEmail({ email });
    if (!user?.email || !user.emailVerified) {
      throw new AuthOtpInvalid();
    }

    const otp = await this.otpRepository.findLatestByUserAndType(
      user.id,
      OtpTypeEnum.PASSWORD_RESET,
    );
    if (!otp || otp.verifiedAt) {
      throw new AuthOtpInvalid();
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      throw new AuthOtpTooManyAttempts();
    }
    if (otp.expiresAt < new Date()) {
      throw new AuthOtpExpired();
    }

    const isValid = await bcrypt.compare(otpCode, otp.hash);
    if (!isValid) {
      await this.otpRepository.incrementAttempts(otp.id);
      throw new AuthOtpInvalid();
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = this.hashResetToken(resetToken);
    const authorized = await this.otpRepository.authorizePasswordReset(
      otp.id,
      resetTokenHash,
      new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000),
    );
    if (!authorized) {
      throw new AuthPasswordResetInvalid();
    }

    return {
      resetToken,
      expiresInSeconds: PASSWORD_RESET_TOKEN_EXPIRY_MINUTES * 60,
    };
  }

  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string,
    queryRunner?: QueryRunner,
  ): Promise<{ message: string }> {
    const user = await this.userService.findOneByEmail({
      email,
      queryRunner,
    });
    if (!user) {
      throw new AuthPasswordResetInvalid();
    }

    const consumed = await this.otpRepository.consumeAuthorizedPasswordReset(
      user.id,
      this.hashResetToken(resetToken),
      queryRunner,
    );
    if (!consumed) {
      throw new AuthPasswordResetInvalid();
    }

    await this.userService.resetPassword({
      id: user.id,
      password: newPassword,
      queryRunner,
    });

    return { message: 'Password reset successfully. You can now sign in.' };
  }

  // ─── Login ─────────────────────────────────────────────────────

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<{
    token: string;
    refreshToken: string;
    tokenExpires: number;
    user: User;
  }> {
    // Find user by email
    const user = await this.userService.findOneByEmail({
      email: loginDto.email,
      relationsAndSelects: userFindOneAuthLogin,
    });

    // Always compare a hash to reduce account-enumeration timing differences.
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user?.password ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !user.password || !isValidPassword) {
      throw new AuthInvalidCredentials();
    }

    // Only disclose the verification state after the password is proven.
    if (!user.emailVerified) {
      throw new AuthEmailNotVerified();
    }

    // Generate tokens
    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  // ─── Refresh Token ─────────────────────────────────────────────

  async refreshToken(refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
    tokenExpires: number;
  }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtRefreshPayloadType>(
        refreshToken,
        {
          secret: this.configService.get('auth.refreshSecret', { infer: true }),
          issuer: this.configService.get('auth.issuer', { infer: true }),
          audience: this.configService.get('auth.audience', { infer: true }),
        },
      );

      if (payload.tokenUse !== 'refresh') {
        throw new AuthInvalidRefreshToken();
      }

      // Find user to ensure they still exist
      const user = await this.userService.findOne({
        id: payload.id,
      });

      if (!user) {
        throw new AuthInvalidRefreshToken();
      }

      if ((payload.tokenVersion ?? 0) !== user.tokenVersion) {
        throw new AuthInvalidRefreshToken();
      }

      // Generate new tokens
      const {
        token,
        refreshToken: newRefreshToken,
        tokenExpires,
      } = await this.getTokensData({
        id: user.id,
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion,
      });

      return {
        token,
        refreshToken: newRefreshToken,
        tokenExpires,
      };
    } catch (error) {
      throw new AuthInvalidRefreshToken();
    }
  }

  // ─── Token Generation (Private) ────────────────────────────────

  private async getTokensData(data: {
    id: User['id'];
    email: User['email'];
    role?: User['role'];
    tokenVersion: number;
  }) {
    const tokenExpiresIn =
      this.configService.get('auth.expires', { infer: true }) || '1h';

    const refreshTokenExpiresIn =
      this.configService.get('auth.refreshExpires', { infer: true }) || '7d';

    // Parse time string to milliseconds (e.g., "1h" -> 3600000)
    const parseTimeToMs = (timeStr: string): number => {
      const match = timeStr.match(/^(\d+)([smhd])$/);
      if (!match) return 3600000; // default 1 hour
      const value = parseInt(match[1], 10);
      const unit = match[2];
      const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
      };
      return value * (multipliers[unit] || 1000);
    };
    const tokenExpires = Date.now() + parseTimeToMs(tokenExpiresIn);

    const secret = this.configService.get('auth.secret', { infer: true });
    const refreshSecret = this.configService.get('auth.refreshSecret', {
      infer: true,
    });
    const issuer = this.configService.get('auth.issuer', { infer: true });
    const audience = this.configService.get('auth.audience', { infer: true });

    if (!secret || !refreshSecret) {
      throw new Error('JWT secrets are not configured');
    }

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: data.id,
          email: data.email || '',
          role: data.role || null,
          tokenUse: 'access',
          tokenVersion: data.tokenVersion,
        },
        {
          secret,
          expiresIn: tokenExpiresIn,
          issuer,
          audience,
        },
      ),
      this.jwtService.signAsync(
        {
          id: data.id,
          email: data.email || '',
          tokenUse: 'refresh',
          tokenVersion: data.tokenVersion,
        },
        {
          secret: refreshSecret,
          expiresIn: refreshTokenExpiresIn,
          issuer,
          audience,
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  private hashResetToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
