import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AxiosError } from 'axios';
import { log } from 'console';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();

    if (exception instanceof InternalServerErrorException) {
      if (exception.cause instanceof AxiosError) {
        Logger.error({
          message: 'AxiosError',
          requestId: http.getRequest().headers['X-Request-Id'],
          err: exception.cause.message,
          stack: exception.stack,
        });
      }
    }
    log(exception);

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException('Something wrong');
    }

    super.catch(exception, host);
  }
}
