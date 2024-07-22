import { Module } from '@nestjs/common';
import { UserOktaService } from './user-okta.service';
import { OidcOktaService } from './oidc-okta.service';

@Module({
  providers: [UserOktaService, OidcOktaService],
  exports: [UserOktaService, OidcOktaService],
})
export class OktaModule {}
