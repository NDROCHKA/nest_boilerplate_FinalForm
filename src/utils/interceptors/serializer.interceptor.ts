import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { from, mergeMap, Observable } from 'rxjs';
import { deepResolvePromises } from '../helpers';

@Injectable()
export class ResolvePromisesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    return next
      .handle()
      .pipe(mergeMap((data: unknown) => from(deepResolvePromises(data))));
  }
}
