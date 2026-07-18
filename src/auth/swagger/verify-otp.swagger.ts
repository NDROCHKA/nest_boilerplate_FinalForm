import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiVerifyOtp() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify email address with 6-digit OTP code' }),
    ApiResponse({
      status: 200,
      description: 'Email verified successfully.',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Email verified successfully.',
          },
        },
      },
    }),
    ApiResponse({ status: 422, description: 'Invalid or expired OTP code' }),
    ApiResponse({ status: 429, description: 'Too many incorrect attempts' }),
  );
}
