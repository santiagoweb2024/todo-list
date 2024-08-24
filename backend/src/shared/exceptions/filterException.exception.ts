import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { HttpExceptionNames } from './ exceptionTypes.enum';

interface ErrorResponse {
  statusCode: number;
  success: boolean;
  message: string;
  path: string;
  errors?: any;
}

// Función para construir la respuesta de error
function buildErrorResponse(
  statusCode: number,
  message: string,
  path: string,
  errors?: any,
): ErrorResponse {
  return {
    statusCode,
    success: false,
    message,
    path,
    errors,
  };
}

@Catch()
export class ExceptionFilterAll implements ExceptionFilter {
  private readonly exceptionHandlers: Record<
    string,
    (exception: HttpException, request: Request) => ErrorResponse
  > = {
    [HttpExceptionNames.Conflict]: (exception, request) =>
      buildErrorResponse(exception.getStatus(), exception.message, request.url),
    [HttpExceptionNames.Validation]: (exception, request) => {
      const errors = exception.getResponse();
      return buildErrorResponse(
        exception.getStatus(),
        exception.message,
        request.url,
        errors,
      );
    },
    [HttpExceptionNames.Forbidden]: (exception, request) =>
      buildErrorResponse(HttpStatus.FORBIDDEN, exception.message, request.url),
    [HttpExceptionNames.Unauthorized]: (exception, request) =>
      buildErrorResponse(
        HttpStatus.UNAUTHORIZED,
        exception.message,
        request.url,
      ),
    // Agrega más manejadores aquí si es necesario
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    if (exception instanceof HttpException) {
      const handler =
        this.exceptionHandlers[exception.name] ||
        ((exc, req) =>
          buildErrorResponse(exc.getStatus(), exc.message, req.url));

      return response
        .status(exception.getStatus())
        .json(handler(exception, request));
    }

    if (exception instanceof QueryFailedError) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          buildErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Database error occurred',
            request.url,
          ),
        );
    }

    // Manejo de otras excepciones no controladas
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        buildErrorResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal server error',
          request.url,
        ),
      );
  }
}
