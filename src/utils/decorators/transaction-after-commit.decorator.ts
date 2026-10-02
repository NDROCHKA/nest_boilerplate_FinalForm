import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AfterCommitCallback = () => void | Promise<void>;
export type RegisterAfterCommit = (callback: AfterCommitCallback) => void;

interface RequestWithAfterCommitCallbacks {
  afterCommitCallbacks?: AfterCommitCallback[];
}

export const TransactionAfterCommit = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RegisterAfterCommit => {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithAfterCommitCallbacks>();

    return (callback: AfterCommitCallback): void => {
      request.afterCommitCallbacks ??= [];
      request.afterCommitCallbacks.push(callback);
    };
  },
);
