import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '../dto/login.dto';
import { Observable } from 'rxjs';
import { ValidationException } from '@/shared/exceptions/validationException.exception';
import { formatErrors } from '@/shared/utils/formatedErrors.util';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  // * El método `canActivate` es el punto de entrada para el guardia de autorización.
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // * Obtenemos el objeto de la solicitud HTTP del contexto de ejecución.
    const request = context.switchToHttp().getRequest();

    // * Convertimos el cuerpo de la solicitud en una instancia del DTO `LoginDto`.
    const loginDto = plainToInstance(LoginDto, request.body);

    // * Validamos el DTO utilizando `class-validator`.
    return validate(loginDto).then((errors) => {
      // ? Si hay errores de validación, los formateamos y lanzamos una excepción personalizada.
      if (errors.length > 0) {
        // * Utilizamos la funcion formatErrors para formatear los errores.
        const formatedErrors = formatErrors(errors);

        // ! Lanzamos una excepción personalizada `ValidationException` con los errores formateados.
        throw new ValidationException(formatedErrors);
      }

      // * Si no hay errores, continuamos con la ejecución normal, llamando a `super.canActivate`.
      return super.canActivate(context) as boolean | Promise<boolean>;
    });
  }
}
