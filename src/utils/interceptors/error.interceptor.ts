import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from '../error/error-handler';

// The .pipe(catchError(...)) operates on the response stream produced by the handler,
// indicating that it intercepts and processes response errors.
@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Define default errorCode and message
        // You can customize these based on the context or error type if needed
        const defaultErrorCode = 'INTERNAL_SERVER_ERROR';
        const defaultMessage =
          'An unexpected error occurred. Please try again later.';

        // Delegate the error handling to the handleError function
        handleError(error, defaultErrorCode, defaultMessage);
      }),
    );
  }
}
