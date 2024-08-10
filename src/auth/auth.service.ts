import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OidcOktaService } from 'src/okta/oidc-okta.service';
import { LoginDto } from './dto/auth.dto';
import { UsersModelService } from 'src/model/usersModel.service';
import { UserOktaService } from 'src/okta/user-okta.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly oidcOkta: OidcOktaService,
    private readonly userOkta: UserOktaService,
    private readonly userModel: UsersModelService,
  ) {}
  async login(dto: LoginDto) {
    //* get id token
    const token = await this.oidcOkta.getIdToken(dto.email, dto.password);

    const payload = await this.oidcOkta.introspectIdToken(token);
    if (!payload || payload.active === false) {
      throw new UnauthorizedException('not authorized');
    }
    // //*get user from okta
    // const user = await this.userOkta.getOne(payload.sub);

    // *get user from db
    const user = await this.userModel.findOne(payload.sub);
    if (!user) throw new BadRequestException('incorrect credential');
    return { token, user };
  }
}
