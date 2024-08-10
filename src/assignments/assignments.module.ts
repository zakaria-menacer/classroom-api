import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import {
  AssignmentsClassroomController,
  AssignmentsController,
} from './assignments.controller';
import { ModelModule } from 'src/model/model.module';
import { FilesModule } from './files/files.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';

@Module({
  controllers: [AssignmentsController, AssignmentsClassroomController],
  providers: [AssignmentsService],
  imports: [ModelModule, FilesModule, SubmissionsModule, ClassroomsModule],
})
export class AssignmentsModule {}
