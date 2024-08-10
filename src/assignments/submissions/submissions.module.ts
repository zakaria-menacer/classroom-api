import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import {
  AssignmentsSubmissionsController,
  SubmissionsController,
} from './submissions.controller';
import { ModelModule } from 'src/model/model.module';
import { AssignmentsService } from '../assignments.service';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';

@Module({
  controllers: [AssignmentsSubmissionsController, SubmissionsController],
  providers: [SubmissionsService, AssignmentsService],
  imports: [ModelModule, ClassroomsModule],
})
export class SubmissionsModule {}
