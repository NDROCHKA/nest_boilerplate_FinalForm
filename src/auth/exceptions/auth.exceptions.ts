import { HttpStatus } from '@nestjs/common';
import { BaseCustomException } from '../../utils/error/global-exceptions';

class AuthException extends BaseCustomException {
  constructor(
    errorCode: string,
    message: string,
    status: HttpStatus,
    details?: Record<string, unknown>,
  ) {
    super(errorCode, message, status, details);
  }
}

export class AuthInvalidCredentials extends AuthException {
  constructor() {
    super(
      'AUTH_INVALID_CREDENTIALS',
      'The email or password is incorrect.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AuthIncorrectPassword extends AuthException {
  constructor(details?: Record<string, unknown>) {
    super(
      'AUTH_INCORRECT_PASSWORD',
      'The password provided is incorrect.',
      HttpStatus.UNPROCESSABLE_ENTITY,
      details,
    );
  }
}

export class AuthUserNotFound extends AuthException {
  constructor(details?: Record<string, unknown>) {
    super(
      'AUTH_USER_NOT_FOUND',
      'User not found with the provided email.',
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

export class AuthInvalidRefreshToken extends AuthException {
  constructor(details?: Record<string, unknown>) {
    super(
      'AUTH_INVALID_REFRESH_TOKEN',
      'The provided refresh token is invalid.',
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}

export class AuthEmailNotVerified extends AuthException {
  constructor(details?: Record<string, unknown>) {
    super(
      'AUTH_EMAIL_NOT_VERIFIED',
      'Please verify your email address before logging in.',
      HttpStatus.FORBIDDEN,
      details,
    );
  }
}

export class AuthOtpInvalid extends AuthException {
  constructor(details?: Record<string, unknown>) {
    super(
      'AUTH_OTP_INVALID',
      'The verification code is incorrect.',
      HttpStatus.UNPROCESSABLE_ENTITY,
      details,
    );
  }
}

export class AuthOtpExpired extends AuthException {
  constructor(details?: Record<string, unknown>) {
    super(
      'AUTH_OTP_EXPIRED',
      'The verification code has expired. Please request a new one.',
      HttpStatus.UNPROCESSABLE_ENTITY,
      details,
    );
  }
}

export class AuthOtpTooManyAttempts extends AuthException {
  constructor(details?: Record<string, unknown>) {
    super(
      'AUTH_OTP_TOO_MANY_ATTEMPTS',
      'Too many incorrect attempts. Please request a new verification code.',
      HttpStatus.TOO_MANY_REQUESTS,
      details,
    );
  }
}

export class AuthOtpResendTooSoon extends AuthException {
  constructor(details?: Record<string, unknown>) {
    super(
      'AUTH_OTP_RESEND_TOO_SOON',
      'Please wait before requesting a new verification code.',
      HttpStatus.TOO_MANY_REQUESTS,
      details,
    );
  }
}
