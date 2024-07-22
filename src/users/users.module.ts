import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OktaModule } from 'src/okta/okta.module';
import { ModelModule } from 'src/model/model.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [OktaModule, ModelModule],
})
export class UsersModule {}
