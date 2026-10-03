import { HttpStatus, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { BaseCustomException } from '../error/global-exceptions';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    return Promise.reject(
      new BaseCustomException(
        'RATE_LIMIT_EXCEEDED',
        'Too many attempts. Please wait a moment and try again.',
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
  }
}
