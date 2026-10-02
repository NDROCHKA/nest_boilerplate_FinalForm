import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiResendOtp() {
  return applyDecorators(
    ApiOperation({ summary: 'Resend OTP verification email' }),
    ApiResponse({
      status: 200,
      description:
        'If the email is registered and unverified, a new code was sent.',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example:
              'If your email is registered and unverified, a new verification code has been sent.',
          },
        },
      },
    }),
    ApiResponse({ status: 429, description: 'Resend requested too soon' }),
  );
}
