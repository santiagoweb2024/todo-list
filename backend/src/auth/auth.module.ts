import { Module } from '@nestjs/common'; // **Importa el decorador Module de NestJS para definir un módulo**
import { PassportModule } from '@nestjs/passport'; // **Importa PassportModule para la integración con Passport**
import { JwtModule } from '@nestjs/jwt'; // **Importa JwtModule para la gestión de JWT**
import { TypeOrmModule } from '@nestjs/typeorm'; // **Importa TypeOrmModule para la integración con TypeORM**

import { config } from '@/shared/constants/envKeys.constant'; // **Importa la configuración de claves y parámetros desde constantes**
import { User } from '@/users/entities/user.entity'; // **Importa la entidad User desde la carpeta de usuarios**
import { UserRepository } from '@/users/repositories/user.repository'; // **Importa el repositorio UserRepository para interactuar con la base de datos**

import { AuthController } from './auth.controller'; // **Importa el controlador AuthController para manejar las solicitudes relacionadas con la autenticación**
import { AuthService } from './auth.service'; // **Importa el servicio AuthService para manejar la lógica de autenticación**

import { RefreshToken } from './entities/refreshToken.entity'; // **Importa la entidad RefreshToken desde la carpeta de entidades de autenticación**
import { RefreshTokenRepository } from './repositories/refreshToken.repository'; // **Importa el repositorio RefreshTokenRepository para interactuar con la base de datos**

import { JwtStrategy } from './strategies/jwtStrategy.strategy'; // **Importa la estrategia JwtStrategy para la autenticación JWT**
import { LocalStrategy } from './strategies/localStrategy.strategy'; // **Importa la estrategia LocalStrategy para la autenticación local**

import { MailService } from '@/mail/mail.service'; // **Importa el servicio MailService para el envío de correos electrónicos**

/**
 * **AuthModule** define el módulo para la autenticación.
 * Este módulo agrupa todos los componentes necesarios para la autenticación, incluyendo el controlador, servicio, repositorio, estrategias y servicios auxiliares.
 */
@Module({
  // **Proveedores de este módulo**: Servicios, estrategias y repositorios utilizados en la autenticación.
  providers: [
    UserRepository, // **Repositorio para interactuar con la base de datos de usuarios**
    RefreshTokenRepository, // **Repositorio para interactuar con la base de datos de tokens de refresco**
    AuthService, // **Servicio que contiene la lógica de autenticación**
    MailService, // **Servicio para el envío de correos electrónicos (importado en el código original pero no en esta versión)**
    LocalStrategy, // **Estrategia de autenticación local utilizando correo electrónico y contraseña**
    JwtStrategy, // **Estrategia de autenticación JWT para verificar tokens de autenticación**
  ],
  // **Importaciones de módulos**: Módulos necesarios para la funcionalidad del módulo de autenticación.
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]), // **Configura TypeORM para trabajar con las entidades User y RefreshToken en este módulo**
    PassportModule, // **Módulo de Passport para la integración con estrategias de autenticación**
    JwtModule.register({
      secret: config.jwt.secretAuth, // **Clave secreta utilizada para firmar los JWT**
      signOptions: { expiresIn: config.jwt.expirationAuth }, // **Opciones de firma del JWT, incluyendo el tiempo de expiración del token**
    }),
  ],
  // **Controladores de este módulo**: Controladores que manejan las solicitudes HTTP.
  controllers: [AuthController], // **Controlador para manejar las rutas relacionadas con la autenticación**
})
export class AuthModule {}
