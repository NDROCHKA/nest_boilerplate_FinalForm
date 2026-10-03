import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Request a password-reset code by email' }),
    ApiResponse({
      status: 200,
      description:
        'Returns the same response whether or not the account exists.',
    }),
    ApiResponse({ status: 429, description: 'Too many requests' }),
  );
}

export function ApiVerifyPasswordResetOtp() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify a password-reset code' }),
    ApiResponse({
      status: 200,
      description: 'Returns a short-lived, single-use reset token.',
    }),
    ApiResponse({ status: 422, description: 'Invalid or expired code' }),
    ApiResponse({ status: 429, description: 'Too many attempts' }),
  );
}

export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Set a new password using a verified reset token',
    }),
    ApiResponse({ status: 200, description: 'Password reset successfully' }),
    ApiResponse({ status: 422, description: 'Invalid or expired reset token' }),
    ApiResponse({ status: 429, description: 'Too many attempts' }),
  );
}
