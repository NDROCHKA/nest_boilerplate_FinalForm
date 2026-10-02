import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

interface RequestWithUser {
  user?: JwtPayloadType;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.id) {
      console.error('GetUser decorator - User or user.id not found in token');
      throw new UnauthorizedException('User ID not found in token');
    }

    return user.id;
  },
);
