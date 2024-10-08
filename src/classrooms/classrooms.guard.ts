import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClassroomsService } from './classrooms.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnedOrEnrolledClassroomsGuard implements CanActivate {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const userId = req?.user?.id;
    if (!userId) return false;

    const classroomId = req.params.id || req.params.classroomId;

    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermission) {
      const haveAdminPermissions = requiredPermission.some((perm) => {
        let allPerm = perm;
        if (!perm.endsWith(':all')) {
          allPerm = perm + ':all';
        }
        return user.permissions?.includes(allPerm);
      });
      if (haveAdminPermissions) return true;
    }

    const classroom = await this.classroomsService.findOne(classroomId);
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    //* Check if the user is the owner of the classroom
    if (classroom.createdBy === userId) {
      return true;
    }
    //* Check if the user is enrolled in the classroom
    return classroom.enrollments.some((e) => e.id === userId);
  }
}
@Injectable()
export class AdminOrOwnedClassroomsGuard implements CanActivate {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const userId = req?.user?.id;
    if (!userId) return false;

    const classroomId = req.params.id || req.params.classroomId;

    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermission) {
      const haveAdminPermissions = requiredPermission.some((perm) => {
        let allPerm = perm;
        if (!perm.endsWith(':all')) {
          allPerm = perm + ':all';
        }

        return user.permissions?.includes(allPerm);
      });

      if (haveAdminPermissions) return true;
    }

    const classroom = await this.classroomsService.findOne(classroomId);
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    //* Check if the user is the owner of the classroom
    if (classroom.createdBy === userId) {
      return true;
    }
    return false;
  }
}
@Injectable()
export class OwnedClassroomsGuard implements CanActivate {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const userId = req?.user?.id;
    if (!userId) return false;

    const classroomId = req.params.id || req.params.classroomId;

    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    const classroom = await this.classroomsService.findOne(classroomId);
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    //* Check if the user is the owner of the classroom
    if (classroom.createdBy === userId) {
      return true;
    }
    return false;
  }
}
