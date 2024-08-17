import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../dto/register.dto';
export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: RegisterDto): Promise<User>;
}

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  findByEmail(email: string): Promise<User | null> {
    const user = this.user.findOne({ where: { email } });
    return user;
  }
  create(user: RegisterDto): Promise<User> {
    const newUser = this.user.create({
      name: user.name,
      email: user.email,
      passwordHash: user.password,
    });
    return this.user.save(newUser);
  }
}
