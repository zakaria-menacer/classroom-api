import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import {
  AssignmentsSubmissionsController,
  SubmissionsController,
} from './submissions.controller';
import { ModelModule } from 'src/model/model.module';

@Module({
  controllers: [AssignmentsSubmissionsController, SubmissionsController],
  providers: [SubmissionsService],
  imports: [ModelModule],
})
export class SubmissionsModule {}
