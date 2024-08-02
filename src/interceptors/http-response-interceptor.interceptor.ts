import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipInterceptor = this.reflector.get<boolean>(
      'skipInterceptor',
      context.getHandler(),
    );
    if (skipInterceptor) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data) || Array.isArray(data?.data)) {
          return {
            message: 'success',
            count: data?.data?.length || data?.length,
            data: data?.data || data,
            statusCode: context.switchToHttp().getResponse().statusCode,
          };
        }

        return {
          message: data?.message || 'success',
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: data?.data || data,
        };
      }),
    );
  }
}
