import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IUserRepository {
  create(user: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  update(userId: number, updateData: Partial<User>): Promise<UpdateResult>;
}
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const newUser = this.user.create({
      name: user.name,
      email: user.email,
      passwordHash: user.password,
    });

    return await this.user.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.user.findOne({ where: { email } });
    return user;
  }

  async update(
    userId: number,
    updateData: Partial<User>,
  ): Promise<UpdateResult> {
    const user = await this.user.update({ userId }, updateData);
    return user;
  }
}
