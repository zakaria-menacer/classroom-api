import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { createReadStream, existsSync } from 'fs';
import { SkipInterceptor } from 'src/tools/skipInterceptor.decorator';
import { join } from 'path';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { AuthorizationGuard } from 'src/auth/authorization.guard';

@Controller('files')
@ApiTags('files')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Get('assignments/:fileId')
  @SkipInterceptor()
  async getAssignmentFile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const file = await this.filesService.findOneAssignmentFile(fileId);
    if (!file || !existsSync(join(__dirname, '../../..', file.path)))
      throw new NotFoundException('File not found');

    const fileStream = createReadStream(join(__dirname, '../../..', file.path));
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fileStream.pipe(res);
  }
  @Get('submissions/:fileId')
  @SkipInterceptor()
  async getSubmissionsFile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const file = await this.filesService.findOneSubmissionFile(fileId);
    if (!file || !existsSync(join(__dirname, '../../..', file.path)))
      throw new NotFoundException('File not found');

    const fileStream = createReadStream(join(__dirname, '../../..', file.path));
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fileStream.pipe(res);
  }
}
