import { Global, Module } from '@nestjs/common';
import { UserOktaService } from './user-okta.service';
import { OidcOktaService } from './oidc-okta.service';

@Global()
@Module({
  providers: [UserOktaService, OidcOktaService],
  exports: [UserOktaService, OidcOktaService],
})
export class OktaModule {}
