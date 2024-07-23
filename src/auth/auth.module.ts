import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OktaModule } from 'src/okta/okta.module';
import { ModelModule } from 'src/model/model.module';
import { UsersModule } from 'src/users/users.module';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [OktaModule, ModelModule, UsersModule],
})
export class AuthModule {}
