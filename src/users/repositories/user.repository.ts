import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IUserRepository {
  create(user: CreateUserDto): Promise<User>;
}
@Injectable()
export class UserRepository implements IUserRepository {
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
}
