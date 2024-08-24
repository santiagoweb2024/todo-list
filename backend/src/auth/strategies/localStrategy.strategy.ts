import { PassportStrategy } from '@nestjs/passport'; // **Importa PassportStrategy desde el módulo de Passport de NestJS**
import { Strategy } from 'passport-local'; // **Importa la estrategia local desde Passport**
import { AuthService } from '../auth.service'; // **Importa el servicio AuthService para validar las credenciales del usuario**
import { Injectable, UnauthorizedException } from '@nestjs/common'; // **Importa los decoradores y excepciones necesarios de NestJS**
import { User } from '@/users/entities/user.entity'; // **Importa la entidad User para devolver los datos del usuario validado**

/**
 * **LocalStrategy** define una estrategia de autenticación local.
 * Esta estrategia verifica las credenciales del usuario basándose en el correo electrónico y la contraseña.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * **Constructor** inicializa la estrategia LocalStrategy con opciones personalizadas.
   *
   * @param authService - Instancia del AuthService para validar las credenciales del usuario.
   */
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // **Especifica el campo a usar como nombre de usuario (correo electrónico)**
      passwordField: 'password', // **Especifica el campo a usar como contraseña**
    });
  }

  /**
   * **validate** es el método utilizado para verificar las credenciales y devolver al usuario.
   * Este método es llamado automáticamente por Passport durante el proceso de autenticación.
   *
   * @param email - El correo electrónico proporcionado por el usuario.
   * @param password - La contraseña proporcionada por el usuario.
   * @returns El objeto de usuario si las credenciales son válidas.
   * @throws UnauthorizedException - Si las credenciales son inválidas.
   */
  async validate(email: string, password: string): Promise<User> {
    // **Llama al AuthService para validar al usuario basado en el correo electrónico y la contraseña**
    const user = await this.authService.validateUser({ email, password });

    // **Si no se encuentra al usuario, lanza una UnauthorizedException**
    if (!user) {
      throw new UnauthorizedException(); // **Indica que la autenticación falló**
    }

    // **Devuelve el usuario validado si las credenciales son correctas**
    return user;
  }
}
