import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ValidationException } from '../exeptions/validationExeption.exeption';

export class CustomValidationPipe extends ValidationPipe {
  override createExceptionFactory(): any {
    return (validationErrors: ValidationError[]) => {
      const formattedErrors = this.formatErrors(validationErrors);
      return new ValidationException(formattedErrors);
    };
  }

  private formatErrors(validationErrors: ValidationError[]): any {
    const errors: { [key: string]: string[] } = {};
    validationErrors.forEach((error) => {
      const { property, constraints } = error;
      if (constraints) {
        errors[property] = Object.values(constraints);
      }
    });
    console.log('---', validationErrors, '---');
    return errors;
  }
}
