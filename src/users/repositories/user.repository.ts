import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IAuthRepository {
  create(user: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  create(user: CreateUserDto): Promise<User> {
    const newUser = this.user.create({
      name: user.name,
      email: user.email,
      passwordHash: user.password,
    });

    return this.user.save(newUser);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.user.findOne({ where: { email } });
    return user;
  }
}
