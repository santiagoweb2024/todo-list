import { Injectable, UnauthorizedException } from '@nestjs/common'; // **Importa los decoradores y excepciones necesarios de NestJS**
import { PassportStrategy } from '@nestjs/passport'; // **Importa PassportStrategy desde el módulo de Passport de NestJS**
import { ExtractJwt, Strategy } from 'passport-jwt'; // **Importa ExtractJwt y Strategy desde passport-jwt para la autenticación JWT**
import { AuthService } from '../auth.service'; // **Importa el servicio AuthService para validar el payload del JWT**

/**
 * **JwtStrategy** define una estrategia de autenticación basada en JWT.
 * Esta estrategia verifica el JWT presente en el encabezado de la solicitud.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * **Constructor** inicializa la estrategia JwtStrategy con opciones personalizadas.
   *
   * @param authService - Instancia del AuthService para validar el payload del JWT.
   */
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // **Extrae el JWT del encabezado de autenticación como un Bearer Token**
      ignoreExpiration: false, // **No ignorar la expiración del JWT, el token debe ser válido y no expirado**
      secretOrKey: 'secret', // **Clave secreta utilizada para firmar y verificar el JWT**
    });
  }

  /**
   * **validate** es el método utilizado para verificar el payload del JWT y devolver al usuario.
   * Este método es llamado automáticamente por Passport después de que el JWT ha sido verificado.
   *
   * @param payload - El contenido del JWT, que incluye la información del usuario.
   * @returns El objeto de usuario si el payload es válido.
   * @throws UnauthorizedException - Si el payload no es válido o no se encuentra el usuario.
   */
  async validate(payload: any) {
    // **Llama al AuthService para validar el payload del JWT**
    const user = await this.authService.validateJwtPayload(payload);

    // **Si no se encuentra al usuario, lanza una UnauthorizedException**
    if (!user) {
      throw new UnauthorizedException(); // **Indica que la autenticación falló**
    }

    // **Devuelve el usuario validado si el payload es correcto**
    return user;
  }
}
