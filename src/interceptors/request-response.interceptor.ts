import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IResponse } from 'src/interfaces/response.interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse> {
    context.switchToHttp().getRequest().headers['X-Request-Id'] = randomUUID();
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        data: data.data,
        meta: data?.meta ?? {},
      })),
    );
  }
}
