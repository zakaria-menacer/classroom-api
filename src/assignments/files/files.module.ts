import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ModelModule } from 'src/model/model.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ModelModule],
})
export class FilesModule {}
