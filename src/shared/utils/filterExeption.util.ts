import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ExeptionFilterAll implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    if (
      exception instanceof HttpException &&
      exception.name === 'ValidationException'
    ) {
      console.log('esty en HttpException:', { ...exception });
      const status = exception.getStatus();
      return response.status(status).json({
        statusCode: response.statusCode,
        success: false,
        message: exception.message,
        path: request.url,
        errors: exception.getResponse(),
      });
    }

    if (exception instanceof QueryFailedError) {
      console.log('esty en QueryFailedError:', { ...exception });
      return response.status(500).json({
        httpStatus: 400,
        message: exception.message,
        path: request.url,
      });
    } else {
      console.log('no se donde esty:', { exception });
      return response.status(500).json({
        httpStatus: 400,
        message: exception,
        path: request.url,
      });
    }
  }
}
