import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user and send OTP verification email' }),
    ApiResponse({
      status: 201,
      description: 'Account created. Verification email sent.',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Account created. Please check your email for the verification code.',
          },
        },
      },
    }),
    ApiResponse({ status: 409, description: 'Email already in use' }),
    ApiResponse({ status: 422, description: 'Validation error' }),
  );
}
