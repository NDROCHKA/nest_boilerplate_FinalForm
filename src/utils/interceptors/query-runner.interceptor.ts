import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { from, lastValueFrom, Observable } from 'rxjs';
import { Request } from 'express';
import { safeRelease } from '../queryRunner/querry-runner-release-mechanism';
import { AfterCommitCallback } from '../decorators/transaction-after-commit.decorator';

interface RequestWithQueryRunner extends Request {
  queryRunner?: QueryRunner;
  afterCommitCallbacks?: AfterCommitCallback[];
}

@Injectable()
export class QueryRunnerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(QueryRunnerInterceptor.name);

  constructor(private readonly dataSource: DataSource) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    return from(this.handleRequest(context, next));
  }

  private async handleRequest(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithQueryRunner>();
    const requestLabel = this.getRequestLabel(request);

    if (!request) {
      return lastValueFrom(next.handle());
    }

    if (request.queryRunner) {
      this.logger.debug(
        `${requestLabel} - Reusing existing QueryRunner from parent context`,
      );
      return lastValueFrom(next.handle());
    }

    const queryRunner = this.dataSource.createQueryRunner();
    request.queryRunner = queryRunner;
    request.afterCommitCallbacks = [];
    this.logger.debug(`${requestLabel} - Created QueryRunner instance`);

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      this.logger.debug(`${requestLabel} - Transaction started`);

      const result = await lastValueFrom(next.handle());
      await queryRunner.commitTransaction();
      this.logger.debug(`${requestLabel} - Transaction committed`);
      this.runAfterCommitCallbacks(request, requestLabel);
      return result;
    } catch (error) {
      this.logger.error(
        `${requestLabel} - Error encountered`,
        error instanceof Error ? error.stack : String(error),
      );
      await this.safeRollback(queryRunner, requestLabel);
      throw error;
    } finally {
      await safeRelease(queryRunner);
      this.logger.debug(`${requestLabel} - QueryRunner released`);
      request.queryRunner = undefined;
      request.afterCommitCallbacks = undefined;
    }
  }

  private runAfterCommitCallbacks(
    request: RequestWithQueryRunner,
    requestLabel: string,
  ): void {
    for (const callback of request.afterCommitCallbacks ?? []) {
      void Promise.resolve()
        .then(callback)
        .catch((error: unknown) => {
          this.logger.error(
            `${requestLabel} - Post-commit callback failed`,
            error instanceof Error ? error.stack : String(error),
          );
        });
    }
  }

  private async safeRollback(
    queryRunner: QueryRunner,
    requestLabel: string,
  ): Promise<void> {
    if (queryRunner.isReleased || !queryRunner.isTransactionActive) {
      return;
    }

    try {
      await queryRunner.rollbackTransaction();
      this.logger.debug(`${requestLabel} - Transaction rolled back`);
    } catch (rollbackError) {
      const errorTrace =
        rollbackError instanceof Error
          ? (rollbackError.stack ?? rollbackError.message)
          : String(rollbackError);
      this.logger.error('Failed to rollback transaction', errorTrace);
    }
  }

  private getRequestLabel(request?: Request): string {
    if (!request) {
      return '[unknown-request]';
    }

    const method = request.method ?? 'UNKNOWN';
    const url = request.originalUrl ?? request.url ?? '[unknown-url]';
    return `${method} ${url ?? '[unknown-url]'}`;
  }
}
