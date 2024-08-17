import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: AuthRepository,
    private readonly mailService: MailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (userExists) {
      throw new Error('User already exists');
    }

    await this.mailService.sendEmail(
      createUserDto.email,
      'Welcome to my NestJS project',
      'Welcome to my NestJS project',
    );

    const hashedPassword = this.hashedPassword(createUserDto.password);
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const formatResponse = {
      id: user.userId,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };
    return formatResponse;
  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    Logger.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private hashedPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
}
