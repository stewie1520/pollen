import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { DomainError } from '../../../shared/ddd';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = 'UnknownError';
    let details: Record<string, any> = {};
    let message: string = 'unknown error';

    if (exception instanceof DomainError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      code = exception.code;
      details = exception.details;
      message = exception.message;
    }

    if (
      Array.isArray(exception) &&
      exception.every((e) => e instanceof ValidationError)
    ) {
      status = HttpStatus.BAD_REQUEST;
      code = ValidationError.name;
      details = exception;
      message = 'Please check your input';
    }

    Logger.error(exception);

    response.status(status).json({
      message,
      code,
      details,
    });
  }
}
