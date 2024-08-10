import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { ModelModule } from 'src/model/model.module';

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  imports: [ModelModule],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
