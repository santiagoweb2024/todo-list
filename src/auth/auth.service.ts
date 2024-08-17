import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repositories/authRepository.repository';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: RegisterDto) {
    const userExists = await this.authRepository.findByEmail(user.email);
    if (userExists) {
      throw new Error('User already exists');
    }

    await this.mailService.sendEmail(
      user.email,
      'Welcome to my NestJS project',
      'Welcome to my NestJS project',
    );

    const hashedPassword = this.hashedPassword(user.password);
    const newUser = await this.authRepository.create({
      ...user,
      password: hashedPassword,
    });

    const formatResponse = {
      id: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      isVerified: newUser.isVerified,
    };
    return formatResponse;
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = this.comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const payload = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }
  private hashedPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  private comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compareSync(password, passwordHash);
  }
}
