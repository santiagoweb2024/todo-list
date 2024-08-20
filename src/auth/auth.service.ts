import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repositories/authRepository.repository';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository, // * Inyección de dependencias para el repositorio de autenticación
    private readonly mailService: MailService, // * Servicio para el envío de correos electrónicos
    private readonly jwtService: JwtService, // * Servicio para generar y verificar tokens JWT
    private readonly dataSource: DataSource, // * Fuente de datos para interactuar con la base de datos y crear QueryRunners
  ) {}

  async register(user: RegisterDto) {
    const queryRunner = this.dataSource.createQueryRunner(); // ! Crea un query runner para manejar la transacción
    await queryRunner.connect(); // * Conecta el query runner con la base de datos
    await queryRunner.startTransaction(); // ! Inicia una nueva transacción
    try {
      const userExists = await this.authRepository.findByEmail(user.email); // TODO: Verifica si el usuario ya existe en la base de datos
      if (userExists) {
        throw new Error('User already exists'); // ! Lanza un error si el usuario ya existe
      }

      const verificationtoken = this.jwtService.sign(
        { email: user.email },
        { expiresIn: '1h' },
      ); // * Genera un token de verificación JWT válido por 1 hora

      await this.mailService.sendEmail(
        user.email,
        'Welcome to my NestJS project',
        `<a href="http://localhost:3000/auth/verify/${verificationtoken}" target="_blank">Click here</a>`,
      ); // * Envía un correo electrónico de verificación al usuario

      const hashedPassword = this.hashedPassword(user.password); // TODO: Hashea la contraseña del usuario usando bcrypt
      const newUser = await this.authRepository.create({
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
      throw error; // ! Lanza el error para que pueda ser manejado por quien llama al método
    } finally {
      await queryRunner.release(); // * Libera el query runner, cerrando la conexión con la base de datos
    }
  }

  async validateUser({ email, password }: LoginDto) {
    const user = await this.authRepository.findByEmail(email); // * Busca un usuario por su email en la base de datos
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
    const user = await this.authRepository.findByEmail(payload.email); // * Busca un usuario por su email usando el payload del JWT
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

  private hashedPassword(password: string) {
    const salt = bcrypt.genSaltSync(10); // * Genera un salt para hashear la contraseña
    const hash = bcrypt.hashSync(password, salt); // * Hashea la contraseña con el salt generado
    return hash; // * Retorna la contraseña hasheada
  }

  private comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compareSync(password, passwordHash); // * Compara la contraseña proporcionada con el hash almacenado
  }
}
