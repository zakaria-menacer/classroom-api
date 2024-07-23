import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    //* there are no permission required
    if (!requiredPermission) return true;

    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    if (!user) return false;

    //* verify if the user has all permissions
    return requiredPermission.some((perm) => user.permissions?.includes(perm));
  }
}
