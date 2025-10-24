import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserDecorator {
  id: string;
  email: string;
}
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDecorator => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
