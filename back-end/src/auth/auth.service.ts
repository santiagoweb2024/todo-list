import { MailService } from '@/mail/mail.service';
import { config } from '@/shared/constants/envKeys.constant';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/repositories/user.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenRepository } from './repositories/refreshToken.repository';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository, // * Repositorio para la gestión de usuarios
    private readonly refreshTokenRepository: RefreshTokenRepository, // * Repositorio para la gestión de tokens de refresco
    private readonly mailService: MailService, // * Servicio para el envío de correos electrónicos
    private readonly jwtService: JwtService, // * Servicio para generar y verificar tokens JWT
    private readonly dataSource: DataSource, // * Fuente de datos para interactuar con la base de datos y crear QueryRunners
  ) {}

  async register(user: RegisterDto) {
    const queryRunner = this.dataSource.createQueryRunner(); // ! Crea un query runner para manejar la transacción
    await queryRunner.connect(); // * Conecta el query runner con la base de datos
    await queryRunner.startTransaction(); // ! Inicia una nueva transacción

    try {
      const userExists = await this.userRepository.findByEmail(user.email); // TODO: Verifica si el usuario ya existe en la base de datos
      if (userExists) {
        throw new ConflictException('user already exists'); // ! Lanza un error si el usuario ya existe
      }

      const verificationtoken = this.jwtService.sign(
        { email: user.email },
        {
          secret: config.jwt.secretVerification,
          expiresIn: config.jwt.expirationVerification,
        },
      ); // * Genera un token de verificación JWT válido por 1 hora

      await this.mailService.sendEmail(
        user.email,
        'Welcome to my NestJS project',
        `<a href="http://localhost:3000/auth/verify/${verificationtoken}" target="_blank">Click here</a>`,
      ); // * Envía un correo electrónico de verificación al usuario

      const hashedPassword = await this.hashedPassword(user.password); // TODO: Hashea la contraseña del usuario usando bcrypt
      const newUser = await this.userRepository.create({
        ...user,
        password: hashedPassword,
      }); // * Crea un nuevo usuario en la base de datos con la contraseña hasheada

      const formatResponse = {
        id: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        isVerified: newUser.isVerified,
      }; // * Formatea la respuesta con los datos relevantes del usuario

      await queryRunner.commitTransaction(); // ! Confirma la transacción, persistiendo los cambios en la base de datos
      return formatResponse; // * Devuelve la respuesta formateada
    } catch (error) {
      await queryRunner.rollbackTransaction(); // ! Revierte la transacción en caso de error
      throw error; // * Lanza el error
    } finally {
      await queryRunner.release(); // * Libera el query runner, cerrando la conexión con la base de datos
    }
  }

  async verifyAccount(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: config.jwt.secretVerification,
    }); // * Verifica el token JWT y extrae los datos del payload
    const user = await this.userRepository.findByEmail(payload.email); // * Busca un usuario por su email usando el payload del JWT
    if (!user) {
      throw new NotFoundException('User not found'); // ! Lanza una excepción si el usuario no existe
    }
    if (user.isVerified) {
      throw new ConflictException('User already verified'); // ! Lanza una excepción si el usuario ya ha sido verificado
    }
    user.isVerified = true; // * Marca el usuario como verificado
    const updatedUser = await this.userRepository.update(user.userId, user); // * Actualiza los cambios en la base de datos
    return updatedUser; // * Retorna el usuario verificado
  }
  async validateUser({ email, password }: LoginDto) {
    const user = await this.userRepository.findByEmail(email); // * Busca un usuario por su email en la base de datos
    if (!user) {
      throw new UnauthorizedException('Invalid email or account not verified'); // ! Lanza una excepción si el usuario no existe o no ha verificado su cuenta
    }
    const isPasswordValid = this.comparePasswords(password, user.passwordHash); // TODO: Compara la contraseña proporcionada con el hash almacenado
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password'); // ! Lanza una excepción si la contraseña no es válida
    }
    return user; // * Retorna el usuario si las validaciones son correctas
  }

  async validateJwtPayload(payload: any) {
    const user = await this.userRepository.findByEmail(payload.email); // * Busca un usuario por su email usando el payload del JWT
    if (!user) {
      throw new UnauthorizedException('Invalid email or account not verified'); // ! Lanza una excepción si el usuario no existe
    }
    return user; // * Retorna el usuario si la validación es exitosa
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.userId }; // * Crea un payload con el email y el ID del usuario
    const token = this.jwtService.sign(payload); // * Genera un token JWT con el payload
    return { message: 'Login successful', token }; // * Devuelve un mensaje de éxito junto con el token
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email); // * Busca un usuario por su email
    if (!user) {
      throw new NotFoundException('User not found'); // ! Lanza una excepción si el usuario no existe
    }
    const token = this.jwtService.sign(
      { email },
      {
        secret: config.jwt.secretResetPassword,
        expiresIn: config.jwt.expirationResetPassword,
      },
    ); // * Genera un token JWT con el email del usuario
    const link = `http://localhost:3000/auth/reset-password/${token}`; // * Construye la dirección del enlace de restablecimiento de contraseña
    await this.mailService.sendEmail(
      email,
      'Reset Password',
      `<a href="${link}">Click here</a> to reset your password`,
    ); // * Enviará un correo electrónico de restablecimiento de contraseña
    return { message: 'Email sent' }; // * Devuelve un mensaje de correo electrónico enviado
  }

  async resetPassword(token: string, password: string) {
    const payload = this.jwtService.verify(token, {
      secret: config.jwt.secretResetPassword,
    }); // * Verifica el token JWT y extrae los datos del payload
    const user = await this.userRepository.findByEmail(payload.email); // * Busca un usuario por su email usando el payload del JWT
    if (!user) {
      throw new NotFoundException('User not found'); // ! Lanza una excepción si el usuario no existe
    }
    const hashedPassword = this.hashedPassword(password); // * Hashea la contraseña proporcionada
    user.passwordHash = hashedPassword; // * Asigna la contraseña hasheada al usuario
    const updatedUser = await this.userRepository.update(user.userId, user); // * Actualiza los cambios en la base de datos
    return updatedUser; // * Retorna el usuario actualizado
  }

  private hashedPassword(password: string) {
    const salt = bcrypt.genSaltSync(10); // * Genera un salt para hashear la contraseña
    const hash = bcrypt.hashSync(password, salt); // * Hashea la contraseña con el salt generado
    return hash; // * Retorna la contraseña hasheada
  }

  private comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compareSync(password, passwordHash); // * Compara la contraseña proporcionada con el hash almacenado
  }
}
