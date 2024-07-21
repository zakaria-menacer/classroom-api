import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { ModelModule } from 'src/model/model.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [ModelModule],
})
export class RolesModule {}
