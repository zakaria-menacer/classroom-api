import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { OidcOktaService } from 'src/okta/oidc-okta.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly oidcOkta: OidcOktaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorization = req?.headers['authorization'];
    if (!authorization) return false;
    const token = authorization.split('Bearer ')[1];
    //*validate token and get payload
    const payload = await this.oidcOkta.introspectIdToken(token);
    if (!payload || payload?.active == false) return false;

    //* fetch user from db
    //* the main goal is to get users permissions
    const user = await this.userService.findOne(payload.sub);
    if (!user) return false;

    req.user = user;
    return true;
  }
}
