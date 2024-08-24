import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(public errors: any) {
    super(errors, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
