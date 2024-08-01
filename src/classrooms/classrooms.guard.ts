import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClassroomsService } from './classrooms.service';

@Injectable()
export class ClassroomsGuard implements CanActivate {
  constructor(private readonly classroomsService: ClassroomsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req?.user?.id;
    if (!userId) return false;

    const classroomId = req.params.id || req.params.classroomId;

    const classroom = await this.classroomsService.findOne(classroomId);
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    // Check if the user is the owner of the classroom
    if (classroom.createdBy === userId) {
      return true;
    }
    return false;
  }
}
