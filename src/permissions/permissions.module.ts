import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { ModelModule } from 'src/model/model.module';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  imports: [ModelModule],
})
export class PermissionsModule {}
