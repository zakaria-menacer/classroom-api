import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
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
    return requiredPermission.some((perm) => {
      //* If the permission does not end with ':all', check if the user has either the exact permission
      //* or the broader permission ending with ':all'
      if (!perm.endsWith(':all')) {
        const allPerm = perm + ':all';
        return (
          user.permissions?.includes(perm) ||
          user.permissions?.includes(allPerm)
        );
      }
      //* If the permission ends with ':all', directly check if the user has it
      return user.permissions?.includes(perm);
    });
  }
}
