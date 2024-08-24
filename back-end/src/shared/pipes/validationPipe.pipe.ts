import { ValidationPipe, ValidationError } from '@nestjs/common'; // **Importa ValidationPipe y ValidationError de NestJS para manejar la validación de datos**
import { ValidationException } from '../exceptions/validationException.exception'; // **Importa ValidationException personalizada para manejar errores de validación**
import { formatErrors } from '../utils/formatedErrors.util';

/**
 * **CustomValidationPipe** extiende ValidationPipe para personalizar el manejo de errores de validación.
 * Esta clase se encarga de formatear los errores de validación y lanzarlos como excepciones personalizadas.
 */
export class CustomValidationPipe extends ValidationPipe {
  /**
   * **Crea una fábrica de excepciones personalizada** que se utiliza para formatear los errores de validación.
   * @returns Una función que crea una instancia de ValidationException con errores formateados.
   */
  override createExceptionFactory(): any {
    return (validationErrors: ValidationError[]) => {
      const formattedErrors = formatErrors(validationErrors);
      return new ValidationException(formattedErrors);
    };
  }
}
