import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OktaModule } from 'src/okta/okta.module';
import { ModelModule } from 'src/model/model.module';

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [OktaModule, ModelModule],
  exports: [UsersService],
})
export class UsersModule {}
