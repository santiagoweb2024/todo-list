import { ExecutionContext, Injectable } from '@nestjs/common'; // **Importa los decoradores y el contexto de ejecución necesarios de NestJS**
import { AuthGuard } from '@nestjs/passport'; // **Importa AuthGuard desde el módulo de Passport de NestJS**
import { Observable } from 'rxjs'; // **Importa Observable desde RxJS para manejar flujos de datos asíncronos**

/**
 * **JwtGuard** es un guard que utiliza la estrategia JWT para proteger las rutas.
 * Este guard asegura que la solicitud contenga un JWT válido antes de permitir el acceso al recurso.
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  /**
   * **canActivate** determina si la solicitud puede acceder al recurso protegido.
   *
   * @param context - El contexto de ejecución de la solicitud actual, que incluye la solicitud HTTP.
   * @returns Un valor booleano, una promesa o un observable que indica si la solicitud puede ser activada.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // **Llama al método canActivate de AuthGuard para aplicar la estrategia JWT**
    return super.canActivate(context);
  }
}
