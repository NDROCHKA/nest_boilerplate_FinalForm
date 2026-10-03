import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { AuthPasswordResetInvalid } from './exceptions/auth.exceptions';
import { OtpRepository } from './infrastructure/otp.repository';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { OtpTypeEnum } from '../utils/enums/otp-type.enum';
import { RoleEnum } from '../utils/enums/roles.enum';

const verifiedUser = {
  id: 7,
  email: 'user@example.com',
  phoneNumber: null,
  firstName: 'Jane',
  lastName: 'Doe',
  emailVerified: true,
  tokenVersion: 0,
  role: RoleEnum.user,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService password reset', () => {
  const jwtService = {
    verifyAsync: jest.fn(),
    signAsync: jest.fn(),
  };
  const userService = {
    findOneByEmail: jest.fn(),
    resetPassword: jest.fn(),
  };
  const configService = { get: jest.fn() };
  const otpRepository = {
    findLatestByUserAndType: jest.fn(),
    deleteAllByUserAndType: jest.fn(),
    create: jest.fn<
      Promise<unknown>,
      [
        data: {
          userId: number;
          hash: string;
          type: OtpTypeEnum;
          expiresAt: Date;
          verifiedAt?: Date | null;
        },
      ]
    >(),
    incrementAttempts: jest.fn(),
    authorizePasswordReset: jest.fn(),
    consumeAuthorizedPasswordReset: jest.fn(),
  };
  const mailService = {
    sendPasswordResetOtp: jest.fn<
      Promise<void>,
      [to: string, otpCode: string, userName?: string]
    >(),
  };

  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: UserService, useValue: userService },
        { provide: ConfigService, useValue: configService },
        { provide: OtpRepository, useValue: otpRepository },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('does not disclose whether an account exists', async () => {
    userService.findOneByEmail.mockResolvedValue(null);

    await expect(
      service.requestPasswordReset('missing@example.com'),
    ).resolves.toEqual({
      message:
        'If an eligible account exists for this email, a reset code has been sent.',
    });
    expect(mailService.sendPasswordResetOtp).not.toHaveBeenCalled();
  });

  it('stores a hashed OTP and emails the reset code', async () => {
    userService.findOneByEmail.mockResolvedValue(verifiedUser);
    otpRepository.findLatestByUserAndType.mockResolvedValue(null);

    await service.requestPasswordReset(verifiedUser.email);

    expect(otpRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: verifiedUser.id,
        type: OtpTypeEnum.PASSWORD_RESET,
        verifiedAt: null,
      }),
    );
    const storedHash = otpRepository.create.mock.calls[0][0].hash;
    const emailedCode = mailService.sendPasswordResetOtp.mock.calls[0][1];
    await expect(bcrypt.compare(emailedCode, storedHash)).resolves.toBe(true);
  });

  it('exchanges a valid OTP for a single-use reset token', async () => {
    const otpCode = '123456';
    userService.findOneByEmail.mockResolvedValue(verifiedUser);
    otpRepository.findLatestByUserAndType.mockResolvedValue({
      id: 12,
      userId: verifiedUser.id,
      hash: await bcrypt.hash(otpCode, 4),
      type: OtpTypeEnum.PASSWORD_RESET,
      attempts: 0,
      expiresAt: new Date(Date.now() + 60_000),
      verifiedAt: null,
      createdAt: new Date(),
    });
    otpRepository.authorizePasswordReset.mockResolvedValue(true);

    const result = await service.verifyPasswordResetOtp(
      verifiedUser.email,
      otpCode,
    );

    expect(result.resetToken).toMatch(/^[a-f0-9]{64}$/);
    expect(result.expiresInSeconds).toBe(600);
    expect(otpRepository.authorizePasswordReset).toHaveBeenCalledWith(
      12,
      expect.stringMatching(/^[a-f0-9]{64}$/),
      expect.any(Date),
    );
  });

  it('consumes the reset token before changing the password', async () => {
    userService.findOneByEmail.mockResolvedValue(verifiedUser);
    otpRepository.consumeAuthorizedPasswordReset.mockResolvedValue(true);

    await expect(
      service.resetPassword(verifiedUser.email, 'a'.repeat(64), 'new-password'),
    ).resolves.toEqual({
      message: 'Password reset successfully. You can now sign in.',
    });
    expect(otpRepository.consumeAuthorizedPasswordReset).toHaveBeenCalledWith(
      verifiedUser.id,
      expect.stringMatching(/^[a-f0-9]{64}$/),
      undefined,
    );
    expect(userService.resetPassword).toHaveBeenCalledWith({
      id: verifiedUser.id,
      password: 'new-password',
      queryRunner: undefined,
    });
  });

  it('rejects a reset token that was already used or expired', async () => {
    userService.findOneByEmail.mockResolvedValue(verifiedUser);
    otpRepository.consumeAuthorizedPasswordReset.mockResolvedValue(false);

    await expect(
      service.resetPassword(verifiedUser.email, 'a'.repeat(64), 'new-password'),
    ).rejects.toBeInstanceOf(AuthPasswordResetInvalid);
    expect(userService.resetPassword).not.toHaveBeenCalled();
  });
});
