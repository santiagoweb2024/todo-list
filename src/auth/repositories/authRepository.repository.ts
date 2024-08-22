import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { RegisterDto } from '../dto/register.dto';
import { RefreshToken } from '../entities/refreshToken.entity';
export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: RegisterDto): Promise<User>;
  update(userId: number, updateData: Partial<User>): Promise<UpdateResult>;
}

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshToken: Repository<RefreshToken>,
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
  update(userId: number, updateData: Partial<User>): Promise<UpdateResult> {
    const user = this.user.update({ userId }, updateData);
    return user;
  }
}
