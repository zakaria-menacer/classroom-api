import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
