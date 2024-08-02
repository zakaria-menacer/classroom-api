import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { ModelModule } from 'src/model/model.module';
import { FilesModule } from './files/files.module';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  imports:[ModelModule, FilesModule]
})
export class AssignmentsModule {}
