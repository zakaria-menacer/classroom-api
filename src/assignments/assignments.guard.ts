import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AssignmentsService } from './assignments.service';
import { ClassroomsService } from 'src/classrooms/classrooms.service';

@Injectable()
export class OwnedOrEnrolledAssignmentGuard implements CanActivate {
  constructor(
    private readonly assignmentService: AssignmentsService,
    private readonly classroomsService: ClassroomsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const userId = req?.user?.id;
    if (!userId) return false;

    const assignmentId = req.params.id || req.params.assignmentId;

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

    const assignment = await this.assignmentService.findOne(assignmentId);
    if (!assignment) {
      throw new NotFoundException('assignment not found');
    }

    const classroom = await this.classroomsService.findOne(
      assignment.classroomId,
    );

    if (!classroom) {
      throw new NotFoundException('classroom not found');
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
export class AdminOrOwnedAssignmentGuard implements CanActivate {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly assignmentService: AssignmentsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const userId = req?.user?.id;
    if (!userId) return false;

    const assignmentId = req.params.id || req.params.assignmentId;

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

    const assignment = await this.assignmentService.findOne(assignmentId);
    if (!assignment) {
      throw new NotFoundException('assignment not found');
    }

    const classroom = await this.classroomsService.findOne(
      assignment.classroomId,
    );

    if (!classroom) {
      throw new NotFoundException('classroom not found');
    }
    //* Check if the user is the owner of the classroom
    if (classroom.createdBy === userId) {
      return true;
    }
    return false;
  }
}
@Injectable()
export class OwnedAssignmentGuard implements CanActivate {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly assignmentService: AssignmentsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;
    const userId = req?.user?.id;
    if (!userId) return false;

    const assignmentId = req.params.id || req.params.assignmentId;

    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    const assignment = await this.assignmentService.findOne(assignmentId);
    if (!assignment) {
      throw new NotFoundException('assignment not found');
    }

    const classroom = await this.classroomsService.findOne(
      assignment.classroomId,
    );

    if (!classroom) {
      throw new NotFoundException('classroom not found');
    }
    //* Check if the user is the owner of the classroom
    if (classroom.createdBy === userId) {
      return true;
    }
    return false;
  }
}
